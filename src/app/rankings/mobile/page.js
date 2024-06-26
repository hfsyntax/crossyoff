import { getPlatformTopPlayers } from "../../../utility_functions";
import Container from "../../components/shared/Container";
import ContentHeader from "../../components/shared/ContentHeader";
import Button from "../../components/shared/Button";
import Table from "../../components/shared/Table";

export const metadata = {
  title: "CrossyOff - Mobile Rankings",
  description: "Generated by create next app",
};

export const revalidate = 86400

const RankingsMobile = async () => {

  const players = await getPlatformTopPlayers("mobile")

  return (
    <Container id="content" className="column no-height">
      <ContentHeader text={"CrossyOff Mobile Rankings"} />
      {players.length === 0 ?
        <b style={{ color: "red" }}>Failed to get mobile rankings</b> :
        <>
          <Button href={"/submitrun"} style={{ backgroundColor: "red", color: "white" }}>Submit Run</Button>
          <Table rowHeaders={["#", "Player", "Score", "Date", "Titles", "Video"]} data={players}></Table>
        </>
      }
    </Container>
  )
}

export default RankingsMobile
