import styles from './page.module.css'
import Image from 'next/image'
import Link from 'next/link';
import { getMembersCount, getTournamentCount } from '@/actions';

export const metadata = {
  description: "Home page for CrossyOff",
};

export const revalidate = 86400

export default async function Home(): Promise<JSX.Element> {
  const tournaments = await getTournamentCount()
  const members = await getMembersCount()
  return (
    <div className={styles.content}>
      <Image priority={true} sizes='50%, 100%' fill={true} className={styles.cover_img} src="/img/main.png" alt='home logo' />
      <div className={styles.cover_txt_container}>
        <h2 className={styles.cover_greeting}>
          Hey, thanks for <span style={{ color: "red" }}>crossing</span> by!
        </h2>
        <p className={styles.cover_description}>CrossyOff is a fan-made Crossy Road platform which allows players at
          any level to compete, learn and meet new friends along the way.
        </p>
        <Link href={"https://discord.gg/7Y3rNBT"} target="_blank" className="btn" style={{ left: "100px", top: "50px" }}>
          Join the Community
        </Link>
        <div className={styles.cover_stats_container}>
            <div className={styles.stat}>
                <span>{tournaments}</span><br />
                <span>Tournaments</span>
            </div>
            <div className={styles.stat}>
                <span>{members}</span><br />
                <span>Members</span>
            </div>
        </div>
      </div>
    </div>
  );
}