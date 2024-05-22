import Container from "../components/shared/Container";
import ContentHeader from "../components/shared/ContentHeader";
import SubmitRun from "../components/custom/SubmitRun";

export const metadata = {
  title: "CrossyOff - Submit Run",
  description: "Generated by create next app",
};

const PlayerLookup = () => {
    return (
    <Container id="content" className="column">
      <ContentHeader text={"CrossyOff Submit Run"}/>
      <SubmitRun/>
    </Container>
  )
}

export default PlayerLookup