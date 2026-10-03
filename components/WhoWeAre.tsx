import CrystalSeed from "./CrystalSeed";
import styles from "./WhoWeAre.module.css";

export default function WhoWeAre() {
  return (
    <section className={styles.panel} aria-labelledby="who-we-are-title">
      <div className={styles.content}>
        <CrystalSeed size={124} className={styles.crystal} />
        <div className={styles.copy}>
          <h2 id="who-we-are-title" className="font-michroma">
            yGa Tecnologías
          </h2>
          <p>
            Años de desarrollo de sistemas de diversa escala e índole, nos
            inspira a resolver sus necesidades de manejo de la información.
          </p>
        </div>
      </div>
    </section>
  );
}