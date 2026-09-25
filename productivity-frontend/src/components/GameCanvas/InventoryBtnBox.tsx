import styles from './GameCanvas.module.css';

export default function InventoryBtnBox() {
  return (
      <svg className={styles.inventoryBtnBox}
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="-0.5 -0.5 51 51"
      >
          <defs>
              <linearGradient>
                  <stop offset="0" stopColor="#000" stopOpacity="1"></stop>
              </linearGradient>
          </defs>
          <g>
              <rect
                  width="50"
                  height="50"
                  x="0"
                  y="0"
                  fill="#fff"
                  fillOpacity="1"
                  fillRule="evenodd"
                  stroke="#75bf40"
                  strokeDasharray="none"
                  strokeOpacity="1"
                  strokeWidth="1"
                  opacity="1"
                  ry="5"
              ></rect>
          </g>
      </svg>
  )
}