import styles from './GameCanvas.module.css';

export default function CurrencyIcon() {
  return (
    <svg className={styles.currencyIcon}
      xmlns="http://www.w3.org/2000/svg"
      width={136.954}
      height={136.954}
      viewBox="0 0 36.236 36.236"
    >
      <g transform="translate(-8.34 -8.34)">
        <circle
          cx={26.458}
          cy={26.458}
          r={17.721}
          style={{
            fill: "#edc446",
            fillOpacity: 1,
            stroke: "#e5b317",
            strokeWidth: 0.79375,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 100,
            strokeDasharray: "none",
            strokeOpacity: 1,
            paintOrder: "markers stroke fill",
          }}
        />
        <path
          d="M19.498 26.495h13.92c.031 0 .056.024.056.053v2.673c0 .03-.025.054-.055.054H19.498a.054.054 0 0 1-.055-.054v-2.673c0-.03.025-.053.055-.053zm9.245-10.56v24.496c0 .053-.04.096-.088.096h-4.394c-.048 0-.087-.043-.087-.096V15.936c0-.054.039-.097.087-.097h4.394c.049 0 .088.043.088.097zm-13.792-.096h23.015c.05 0 .09.04.09.088v4.394a.09.09 0 0 1-.09.088H14.951a.09.09 0 0 1-.091-.088v-4.394a.09.09 0 0 1 .09-.088z"
          style={{
            fill: "#d4a613",
            fillOpacity: 1,
            stroke: "#e5b317",
            strokeWidth: 0.529,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 100,
            paintOrder: "markers stroke fill",
          }}
        />
      </g>
    </svg>
  )
}