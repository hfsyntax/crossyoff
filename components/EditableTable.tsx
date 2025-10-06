"use client"
import type { CastlePlayer } from "@/types"
import type { CSSProperties, FormEvent } from "react"
import type { Size } from "react-virtualized-auto-sizer"
import {
  addPlayer,
  deleteLeaderboard,
  removePlayers,
  updatePoints,
} from "@/app/actions"
import { faPlus, faTrash, faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  useState,
  useEffect,
  useRef,
  useActionState,
  startTransition,
} from "react"
import { FixedSizeList } from "react-window"
import { useRouter, useSearchParams } from "next/navigation"
import AutoSizer from "react-virtualized-auto-sizer"
import Image from "next/image"
import CreateTableButton from "./CreateTableButton"
import PlayerLookupHandler from "./PlayerLookupHandler"

const nonDisplayedCols = [
  "table_id",
  "table_name",
  "row_id",
  "discord_id",
  "avatar_url",
]

function Row({
  index,
  style,
  columns,
  rows,
  checkedRows,
  pendingAction,
  onPointsChange,
  onCheckboxChange,
  onShowModal,
}: {
  index: number
  style: CSSProperties
  columns: string[]
  rows: CastlePlayer[]
  checkedRows: Set<number>
  pendingAction: boolean
  onPointsChange: (rowId: number, field: string, value: string) => void
  onCheckboxChange: (id: number) => void
  onShowModal: (username: string, rowId: number) => void
}) {
  const row = rows[index]

  if (!row) return null

  return (
    <div
      style={{ ...style }}
      className={`flex items-center ${index === 0 ? "bg-slate-700" : "bg-slate-200"} `}
    >
      {Object.keys(row)
        .filter((field) => !nonDisplayedCols.includes(field))
        .map((field: string, rowIndex: number) =>
          index === 0 ? (
            <span
              key={`${field}_${row["table_id"]}_${row["row_id"]}`}
              className={`relative flex-none ${field === "rank" && "pl-2"} ${field === "username" ? "w-3/5" : "w-1/5"} bg-slate-700 text-xs text-white sm:text-sm md:text-base lg:text-lg xl:text-xl`}
            >
              {columns[rowIndex]}
            </span>
          ) : field === "rank" ? (
            <div
              className="flex h-full w-1/5 flex-none items-center gap-2"
              key={`${field}_${row["table_id"]}_${row["row_id"]}`}
            >
              <input
                type="checkbox"
                checked={checkedRows.has(row["row_id"])}
                disabled={pendingAction}
                className="relative ml-2 h-3 w-5 cursor-pointer sm:h-4 lg:h-5"
                name="delete_row"
                onChange={() => onCheckboxChange(row["row_id"])}
              />
              <span
                className={`relative pl-0 text-xs text-black outline-none sm:text-sm md:text-base lg:text-lg xl:text-xl`}
              >
                {row["rank"]}
              </span>
            </div>
          ) : field === "points" ? (
            <div
              className="flex w-1/5 flex-none gap-2"
              key={`${field}_${row["table_id"]}_${row["row_id"]}`}
            >
              <input
                className="w-3/4 bg-transparent pl-2 text-xs text-black outline-none hover:bg-slate-400 focus:bg-slate-400 sm:text-sm md:text-base lg:text-lg xl:text-xl"
                defaultValue={row[field]}
                disabled={pendingAction}
                onBlur={(e) =>
                  onPointsChange(row["row_id"], field, e.target.value)
                }
              />

              <FontAwesomeIcon
                icon={faTrash}
                size="xl"
                className="relative mb-auto ml-auto mr-3 mt-auto cursor-pointer !text-xs hover:text-slate-600 sm:!text-sm md:!text-base lg:!text-lg xl:!text-2xl"
                onClick={() => onShowModal(row["username"], row["row_id"])}
              />
            </div>
          ) : (
            <div
              className="relative flex w-3/5 flex-none items-center gap-2"
              key={`${field}_${row["table_id"]}_${row["row_id"]}`}
            >
              <Image
                width={0}
                height={0}
                alt="profile_pic"
                sizes="(max-width: 768px) 35px, (max-width: 1000px) 40px, (min-width: 1001px) 50px"
                src={row["avatar_url"]}
                className="h-[35px] w-[35px] md:h-[40px] md:w-[40px] lg:h-[50px] lg:w-[50px]"
              />
              <span className="text-xs text-black sm:text-sm md:text-base lg:text-lg xl:text-xl">
                {row["username"]}
              </span>
            </div>
          ),
        )}
    </div>
  )
}

export default function EditableTable({
  data,
  columns,
  tableEmpty,
}: {
  data: CastlePlayer[]
  columns: string[]
  tableEmpty: boolean
}) {
  const [rows, setRows] = useState<CastlePlayer[]>(data)
  const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set())
  const [user, setUser] = useState<{ username: string; rowId: number }>()
  const [formResponse, setFormResponse] = useState<{
    type: "delete" | "update" | "add" | "remove"
    error: string
    message: string
  } | null>(null)
  const [removePlayerResponse, removeAction, removePending] = useActionState(
    removePlayers,
    null,
  )
  const [updatePointsResponse, pointsAction, pointsPending] = useActionState(
    updatePoints,
    null,
  )
  const [addPlayerResponse, addAction, addPending] = useActionState(
    addPlayer,
    null,
  )
  const [deleteTableResponse, deleteAction, deletePending] = useActionState(
    deleteLeaderboard,
    null,
  )

  const pendingAction =
    removePending || pointsPending || addPending || deletePending
  const [modalConfirm, setModalConfirm] = useState<{
    type: "remove" | "delete" | "add"
    context: "multiple" | "single"
  } | null>(null)

  const addPlayerButton = useRef<SVGSVGElement>(null)
  const addPlayerForm = useRef<HTMLFormElement>(null)

  const router = useRouter()
  const params = useSearchParams()

  const handlePointsChange = (rowId: number, field: string, value: string) => {
    if (pendingAction) return
    const parsed = Number(value)
    const oldValue = rows.find((row) => row.row_id === rowId)?.[
      field as keyof CastlePlayer
    ]
    if (parsed === oldValue) return
    if (isNaN(parsed) || parsed < 0 || parsed > 9999)
      return setRows((prev) =>
        prev.map((row) =>
          row.row_id === rowId && oldValue
            ? { ...row, [field]: oldValue }
            : row,
        ),
      )
    startTransition(() => pointsAction({ rowId, points: parsed }))
  }

  const showSingleDeleteModal = (username: string, rowId: number) => {
    setUser({ username, rowId })
    setModalConfirm({ type: "remove", context: "single" })
  }

  const toggleAddPlayerModal = () => {
    setModalConfirm((prev) =>
      prev?.type === "add" ? null : { type: "add", context: "single" },
    )
  }

  const toggleDeleteLeaderboardModal = () => {
    setModalConfirm((prev) =>
      prev?.type === "delete" ? null : { type: "delete", context: "single" },
    )
  }

  const closeModal = () => {
    if (formResponse?.error || formResponse?.message) setFormResponse(null)
    setModalConfirm(null)
  }

  const deleteRows = (rowIds: Set<number>) => {
    if (pendingAction) return
    startTransition(() => removeAction(rowIds))
  }

  const handleConfirmation = () => {
    if (modalConfirm?.type === "delete" && rows[0].table_id) {
      startTransition(() => deleteAction(rows[0].table_id))
    } else if (modalConfirm?.context === "single" && user?.rowId)
      deleteRows(new Set([user.rowId]))
    else if (modalConfirm?.context === "multiple" && checkedRows.size > 0)
      deleteRows(checkedRows)
  }

  const toggleCheckbox = (id: number) => {
    setCheckedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleAddPlayer = async (event: FormEvent<HTMLFormElement>) => {
    if (!addPlayerForm.current || pendingAction) return
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)
    const discordUsername = String(formData.get("discord_username")).trim()
    const points = parseInt(String(formData.get("points")).trim())

    if (
      !discordUsername ||
      discordUsername.length < 2 ||
      discordUsername.length > 32
    )
      return setFormResponse((prev) => ({
        type: "add",
        error: "Discord username must be between 2-32 characters.",
        message: "",
      }))

    if (isNaN(points) || points < 0 || points > 9999)
      return setFormResponse((prev) => ({
        type: "add",
        error: "Points must be a number between 0 and 9999",
        message: "",
      }))

    startTransition(() => addAction(formData))
  }

  useEffect(() => {
    if (removePlayerResponse?.success) {
      setModalConfirm(null)
      setCheckedRows(new Set())
    }
    if (removePlayerResponse?.error)
      setFormResponse({
        type: "remove",
        error: removePlayerResponse.error,
        message: "",
      })
  }, [removePlayerResponse])

  useEffect(() => {
    if (addPlayerResponse?.error) {
      setFormResponse({
        type: "add",
        error: addPlayerResponse.error,
        message: "",
      })
    } else if (addPlayerResponse?.success) {
      setFormResponse({
        type: "add",
        error: "",
        message: addPlayerResponse.success,
      })
      addPlayerForm.current?.reset()
    }
  }, [addPlayerResponse])

  useEffect(() => {
    if (updatePointsResponse?.error)
      setFormResponse({
        type: "update",
        error: updatePointsResponse.error,
        message: "",
      })
  }, [updatePointsResponse])

  useEffect(() => {
    if (deleteTableResponse?.success) setModalConfirm(null)
    else if (deleteTableResponse?.error)
      setFormResponse({
        type: "delete",
        error: deleteTableResponse.error,
        message: "",
      })
  }, [deleteTableResponse])

  useEffect(() => {
    setRows(data)
  }, [data])

  useEffect(() => {
    const evtSource = new EventSource("/api/refreshLeaderboard")

    evtSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.message === "refresh") router.refresh()
    }

    return () => evtSource.close()
  }, [])

  return (
    <>
      <div className="mb-3 flex w-full items-center gap-2 pl-1">
        <CreateTableButton />
        {rows.length > 0 && (
          <button
            className={`md:p2 w-fit cursor-pointer border-none bg-slate-700 p-3 text-xs font-bold text-white duration-500 ease-in-out hover:rounded-xl hover:bg-slate-100 hover:text-red-500 lg:text-sm xl:text-base`}
            onClick={toggleDeleteLeaderboardModal}
          >
            Delete Leaderboard
          </button>
        )}
        {rows.length > 0 && (
          <div className="relative mb-auto ml-auto mr-6 mt-auto md:mr-8">
            <FontAwesomeIcon
              ref={addPlayerButton}
              icon={faPlus}
              size="2x"
              className="peer mb-auto mt-auto w-fit cursor-pointer rounded-md bg-black p-1 !text-lg text-white hover:bg-slate-500 md:!text-2xl lg:!text-3xl"
              onClick={toggleAddPlayerModal}
            />
            <span className="absolute left-1/2 top-[-30px] hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-black p-1 text-xs text-white peer-hover:block md:top-[-35px] md:text-sm lg:text-base">
              add player
            </span>
          </div>
        )}
      </div>

      {!tableEmpty && <PlayerLookupHandler />}

      {formResponse?.type === "update" && formResponse.error && (
        <div
          className={`absolute left-1/2 z-10 box-border flex w-[400px] -translate-x-1/2 flex-col rounded-md border border-black bg-slate-100 p-5`}
        >
          <span className="p-2 text-xl">
            Error updating points: {formResponse.error}
          </span>
          <button
            type="button"
            className={`ml-auto mr-auto w-fit border-none bg-red-500 pb-3 pl-6 pr-6 pt-3 font-bold text-white duration-500 ease-in-out hover:rounded-xl hover:bg-slate-400`}
            onClick={closeModal}
          >
            Ok
          </button>
        </div>
      )}
      {modalConfirm?.type === "add" && (
        <form
          ref={addPlayerForm}
          className="absolute left-1/2 z-10 flex h-[300px] w-[300px] -translate-x-1/2 flex-col rounded-md bg-slate-400 sm:w-[400px]"
          onSubmit={handleAddPlayer}
        >
          <FontAwesomeIcon
            icon={faX}
            size="lg"
            className="ml-auto mr-3 mt-3 cursor-pointer hover:text-red-500"
            onClick={closeModal}
          />
          <h1 className="mb-4 mt-1 text-center text-3xl">Add Player</h1>
          <label className="ml-3 text-lg" htmlFor="discord_username">
            Discord Username
          </label>
          <input
            type="text"
            id="discord_username"
            name="discord_username"
            placeholder="Discord Username"
            autoComplete="name"
            maxLength={32}
            spellCheck={false}
            required
            className="ml-3 mr-3 box-border h-10 w-[calc(100%_-24px)] border border-black pb-0 pl-5 pr-5 outline-none focus:border-red-500"
          />
          <label className="ml-3 text-lg" htmlFor="points">
            Points
          </label>
          <input
            type="text"
            id="points"
            name="points"
            placeholder="Points"
            autoComplete="off"
            min={0}
            max={9999}
            required
            className="ml-3 mr-3 box-border h-10 w-[calc(100%_-24px)] border border-black pb-0 pl-5 pr-5 outline-none focus:border-red-500"
            maxLength={4}
          />
          <div className="ml-auto mr-auto">
            <button
              type="submit"
              disabled={pendingAction}
              className={`mt-3 w-fit border-none bg-red-500 p-3 font-bold text-white ${!pendingAction && "duration-500 ease-in-out hover:rounded-xl hover:bg-slate-100 hover:text-red-500"}`}
            >
              {addPending ? "loading..." : "Submit"}
            </button>
            <button
              type="button"
              className={`ml-3 mt-3 w-fit border-none bg-red-500 p-3 font-bold text-white ${!pendingAction && "duration-500 ease-in-out hover:rounded-xl hover:bg-slate-100 hover:text-red-500"}`}
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
          {formResponse?.type === "add" && formResponse.error !== "" && (
            <span className="ml-1 text-red-500">{formResponse.error}</span>
          )}
          {formResponse?.type === "add" && formResponse.message && (
            <span className="ml-1 text-green-700">{formResponse.message}</span>
          )}
        </form>
      )}
      {(modalConfirm?.type === "remove" || modalConfirm?.type === "delete") && (
        <div className="absolute left-1/2 z-10 flex w-[300px] -translate-x-1/2 flex-col rounded-md bg-slate-100 p-5 text-sm md:w-[400px] md:text-base lg:text-lg">
          <span className="p-2">
            Are you sure you want to delete&nbsp;
            {modalConfirm.type === "delete"
              ? "this leaderboard?"
              : modalConfirm.context === "single"
                ? `the player ${user?.username}?`
                : `the selected ${checkedRows.size > 1 ? "players?" : "player?"}`}
          </span>
          <div className="ml-auto mr-auto mt-3">
            <button
              type="button"
              disabled={pendingAction}
              onClick={handleConfirmation}
              className={`w-fit border-none bg-red-500 pb-3 pl-6 pr-6 pt-3 font-bold text-white ${!pendingAction && "duration-500 ease-in-out hover:rounded-xl hover:bg-slate-400"}`}
            >
              {pendingAction ? "loading..." : "Yes"}
            </button>
            <button
              type="button"
              className={`ml-3 mt-3 w-fit border-none bg-red-500 pb-3 pl-6 pr-6 pt-3 font-bold text-white ${!pendingAction && "duration-500 ease-in-out hover:rounded-xl hover:bg-slate-400"}`}
              onClick={closeModal}
            >
              {pendingAction ? "loading..." : "No"}
            </button>
          </div>
          {formResponse?.type === "remove" && formResponse.error && (
            <span className="text-red-500">{formResponse.error}</span>
          )}
        </div>
      )}
      {checkedRows.size > 0 && (
        <div className="mt-2 box-border flex h-[50px] items-center border border-slate-700 bg-slate-100 pl-3">
          <span className="text-gray-500">
            {checkedRows.size > 1
              ? `${checkedRows.size} players selected.`
              : `${checkedRows.size} player selected.`}
          </span>
          <span
            className="ml-auto cursor-pointer pr-2 uppercase text-red-500 hover:text-red-800"
            onClick={() =>
              setModalConfirm({ type: "remove", context: "multiple" })
            }
          >
            {removePending || pointsPending ? "loading..." : "delete selected"}
          </span>
        </div>
      )}
      {rows.length > 1 ? (
        <div className={`${checkedRows.size === 0 && "mt-2"} h-full w-full`}>
          <div className={`ml-auto mr-auto h-full`}>
            <AutoSizer>
              {({ height, width }: Size) => (
                <FixedSizeList
                  height={height}
                  itemCount={rows.length}
                  itemSize={50}
                  width={width}
                >
                  {({ index, style }) => (
                    <Row
                      index={index}
                      style={style}
                      columns={columns}
                      rows={rows}
                      checkedRows={checkedRows}
                      pendingAction={pendingAction}
                      onPointsChange={handlePointsChange}
                      onCheckboxChange={toggleCheckbox}
                      onShowModal={showSingleDeleteModal}
                    />
                  )}
                </FixedSizeList>
              )}
            </AutoSizer>
          </div>
        </div>
      ) : rows.length > 0 ? (
        <span className="mt-3 pl-1 text-red-500">
          {params.get("search") ? "no results" : "leaderboard is empty"}
        </span>
      ) : (
        <span className="mt-3 pl-1 text-red-500">
          leaderboard does not exist
        </span>
      )}
    </>
  )
}
