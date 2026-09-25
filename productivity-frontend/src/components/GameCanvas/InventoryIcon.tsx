import styles from './GameCanvas.module.css';

export default function InventoryIcon() {
  return (
    <svg className={styles.inventoryIcon}
      xmlns="http://www.w3.org/2000/svg"
      width={90}
      height={90}
      viewBox="0 0 181.6 181.6"
    >
      <path
        d="M100 10h90l-4 180h-86zm0 0H10l4 180h86Z"
        className="UnoptimicedTransforms"
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
        transform="translate(-9.2 -9.2)"
      />
      <path
        d="M113.044 83.364h3.513v33.272h-3.513zm-17.821 0H91.71v33.272h3.513z"
        className="UnoptimicedTransforms"
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
        transform="translate(-13.333 -12.713)"
      />
    </svg>
  )
}