import AIPanel from "@/components/AIPanel";
import CrystalSeed from "@/components/CrystalSeed";
import Image from "next/image";

const productInfoSections = [
  {
    id: "womex",
    imagen_marco: "/brand_1.png",
    imgen_logo: "",
    titulo: "WOMEX",
    texto:
      "Gestione su negocio de comercio nacional/internacional. WOMEX consolida toda la información desde su acuerdo (contrato), pasando por el transporte, estadías, pagos y otros. Sea notificado en tiempo real de información crítica para su negocio.",
    subtexto:
      "Experimente la reportabilidad en tiempo real y ahorre decidiendo mejor respecto a sus clientes y productos críticos.",
  },
  {
    id: "sg-metroruma",
    imagen_marco: "/brand_2.png",
    imgen_logo: "",
    titulo: "SG MetroRuma",
    texto:
      "Potencie al máximo sus sistemas de trato de madera, con gestión de producción y reporte en pantalla/celular.",
    subtexto: "Todo el panel de tu negocio, en tu celular o computadora.",
  },
  {
    id: "partysuite",
    imagen_marco: "/brand_4.png",
    imgen_logo: "",
    titulo: "PartySuite",
    texto:
      "Gestione todo respecto a sus listas de invitados. En puerta, y con su rut u otro documento, revisa la asistencia de forma rápida, pudiendo chequear además, que tan efectivo es tu equipo en sus inscripciones.",
    subtexto: "Con ésto, las listas ordenadas, registradas y claras.",
  },
];

const quickPromptInfoSections = [
  {
    id: "who-we-are-1",
    marco: 2,
    layout: "vertical",
    nodo: <CrystalSeed size={200} className="who-we-are-crystal" />,
    titulo: "yGa Tecnologías",
    texto:
      "Años de desarrollo de sistemas de diversa escala e índole, nos inspira a resolver sus necesidades de manejo de la información.",
  },
  {
    id: "who-we-are-2",
    marco: 2,
    layout: "vertical",
    nodo: (
      <Image
        src="/yga-logo.png"
        alt="yGa"
        width={340}
        height={340}
        className="who-we-are-logo"
      />
    ),
    titulo: "Tecnologías al alcance",
    texto:
      "Experimente una solución para usted y no una solución para el mercado. Consideramos y mejoramos como hace usted las cosas.",
  },
  {
    id: "who-we-are-3",
    marco: 2,
    layout: "vertical",
    nodo: <Image
        src="/garantia.png"
        alt="yGa"
        width={340}
        height={340}
        className="who-we-are-logo"
      />,
    titulo: "Garantía de éxito",
    texto:
      "Cada proyecto es un desafío único. Cuénte con nuestra guía. Le ayudamos a simplificar toda complejidad en su negocio.",
  },
  {
    id: "who-we-are-4",
    marco: 2,
    layout: "vertical",
    nodo: (
      <Image
        src="/config.png"
        alt="yGa"
        width={340}
        height={340}
        className="who-we-are-logo"
      />
    ),
    titulo: "yGa",
    texto:
      "Flexibilidad en ajustes. En el tiempo, identificamos mejoras, y lo ayudamos a concretarlas a tiempo.",
  },
];

export default function Home() {
  return (
    <AIPanel
      sections={productInfoSections as never[]}
      quickPromptSections={quickPromptInfoSections as never[]}
    />
  );
}