"use client"
import type { CSSProperties } from "react"
import type { Size } from "react-virtualized-auto-sizer"
import type { QueryResultRow } from "@vercel/postgres"
import { FixedSizeList } from "react-window"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrophy, faVideo } from "@fortawesome/free-solid-svg-icons"
import AutoSizer from "react-virtualized-auto-sizer"
import Link from "next/link"
import Image from "next/image"

const nonDisplayedCols = [
  "flag",
  "id",
  "tournament_logo",
  "bracket_url2",
  "winner_country",
]
const fragmentColumns = [
  "name",
  "video_url",
  "winner",
  "bracket_url",
  "player_name",
]

function Row({
  index,
  style,
  columns,
  data,
}: {
  index: number
  style: CSSProperties
  columns: string[]
  data: any
}) {
  const row = data[index]
  return (
    <div
      style={{ ...style }}
      className={`flex items-center ${index === 0 ? "bg-slate-700" : "bg-slate-200"} `}
    >
      {Object.keys(row)
        .filter((field) => !nonDisplayedCols.includes(field))
        .map((field: string, rowIndex: number) =>
          index === 0 || !fragmentColumns.includes(field) ? (
            <span
              key={`${field}_${row["id"] ? row["id"] : row["tournament_number"] ? row["tournament_number"] : index}`}
              className={`relative inline-block text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl ${["Player", "Name", "Winner"].includes(columns[rowIndex]) ? "flex-[3] md:flex-[2]" : row[field] instanceof Date || columns[rowIndex] === "date" ? "flex-[2] md:flex-[1]" : columns[rowIndex] === "#" ? "flex-[0.5]" : "flex-[1]"} pl-2 ${
                index === 0
                  ? "bg-slate-700 text-white"
                  : row[field] === "Completed"
                    ? "text-green-700"
                    : row[field] === "In-Progress"
                      ? "text-[coral]"
                      : "text-black"
              } `}
            >
              {index === 0
                ? columns[rowIndex]
                : row[field] instanceof Date
                  ? row[field].toLocaleDateString()
                  : row[field]}
            </span>
          ) : ["video_url", "bracket_url"].includes(field) ? (
            <div
              className="flex flex-[1] pl-2 leading-[50px]"
              key={`${field}_${row["id"] ? row["id"] : row["tournament_number"] ? row["tournament_number"] : index}`}
            >
              {(row["bracket_url"] || row["video_url"]) && (
                <Link
                  href={
                    row["video_url"]
                      ? row["video_url"]
                      : row["bracket_url"]
                        ? row["bracket_url"]
                        : "#"
                  }
                  target="_blank"
                  className="hover:text-red-500"
                >
                  <FontAwesomeIcon
                    icon={row["bracket_url"] ? faTrophy : faVideo}
                    size="2xl"
                    className="link-icon"
                    preserveAspectRatio="xMinYMin meet"
                  />
                </Link>
              )}
              {row["bracket_url2"] && (
                <Link
                  href={row["bracket_url2"] ? row["bracket_url2"] : "#"}
                  target="_blank"
                  className="hover:text-red-500"
                >
                  <FontAwesomeIcon
                    icon={faTrophy}
                    size="2xl"
                    className="link-icon"
                    preserveAspectRatio="xMinYMin meet"
                  />
                </Link>
              )}
            </div>
          ) : (
            <div
              key={`${field}_${row["id"] ? row["id"] : row["tournament_number"] ? row["tournament_number"] : index}`}
              className={`relative flex h-full flex-[3] items-center pl-2 leading-[50px] md:flex-[2]`}
            >
              <Image
                width={50}
                height={50}
                src={
                  row["flag"]
                    ? `/img/flags/${row["flag"]}.png`
                    : field === "winner"
                      ? row["winner_country"]
                        ? `/img/flags/${row["winner_country"]}.png`
                        : "/img/flags/un.png"
                      : field === "name"
                        ? row["tournament_logo"]
                          ? `/img/${row["tournament_logo"]}.png`
                          : "/img/flags/un.png"
                        : "/img/flags/un.png"
                }
                alt="profile_pic"
                className="h-auto w-[25px] md:w-[30px] xl:w-[40px]"
              />

              {field === "player_name" ? (
                <Link
                  href={`/player/${row["id"]}`}
                  className="text-xs hover:text-red-500 sm:text-sm md:text-base lg:text-lg xl:text-xl"
                >
                  <span className="ml-1 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                    {row[field]}
                  </span>
                </Link>
              ) : (
                <span className="ml-1 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                  {row[field]}
                </span>
              )}
            </div>
          ),
        )}
    </div>
  )
}

export default function FixedTable({
  data,
  columns,
  minWidth,
  height,
  grow,
}: {
  data: QueryResultRow[]
  columns: string[]
  minWidth?: number
  height?: number //static height
  grow?: boolean //fill rest of page container
}) {
  return (
    <div
      className={`mt-5 w-full ${grow && "flex-grow"}`}
      style={{ height: height === undefined ? "100%" : `${height}px` }}
    >
      <div className={`ml-auto mr-auto h-full ${minWidth && "overflow-auto"}`}>
        <AutoSizer>
          {({ height, width }: Size) => (
            <FixedSizeList
              height={height}
              itemCount={data.length}
              itemSize={50}
              width={width}
              style={{ minWidth: minWidth ? minWidth : 0 }}
            >
              {({ index, style }) => (
                <Row
                  index={index}
                  style={style}
                  columns={columns}
                  data={data}
                />
              )}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </div>
  )
}
