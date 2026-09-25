import styles from './GameCanvas.module.css';

export default function InventoryIconHover() {
  return (
    <svg className={styles.inventoryIcon}
      xmlns="http://www.w3.org/2000/svg"
      width={90}
      height={90}
      viewBox="0 0 181.6 191.18"
    >
      <path
        d="M10 10h180l-4 180H14Z"
        style={{
          fill: "#1e1e1d",
          fillOpacity: 1,
          stroke: "#222",
          strokeWidth: 1.6,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeDasharray: "none",
          strokeOpacity: 1,
        }}
        transform="translate(-9.2 -4.58)"
      />
      <path
        d="M110 5.38 190 10l-4 180-76 4.96zm-20 0L10 10l4 180 76 4.96z"
        style={{
          fill: "#8c5713",
          fillOpacity: 1,
          stroke: "#222",
          strokeWidth: 1.6,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeDasharray: "none",
          strokeOpacity: 1,
        }}
        transform="translate(-9.2 -4.58)"
      />
      <path
        d="M113.457 83.364h3.1v33.272h-3.1zm-38.002 0h-3.1v33.272h3.1z"
        style={{
          fill: "#ffc40b",
          fillOpacity: 1,
          stroke: "#222",
          strokeWidth: 2.4,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeMiterlimit: 100,
          strokeDasharray: "none",
          strokeOpacity: 1,
          paintOrder: "markers stroke fill",
        }}
        transform="translate(-3.656 -8.049)"
      />
    </svg>
  )
}
