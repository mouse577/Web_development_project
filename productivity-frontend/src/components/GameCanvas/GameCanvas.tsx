import * as THREE from 'three'
import { useContext, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import styles from './GameCanvas.module.css';

import { AuthUserData } from '../../types';
import { UserContext } from '../../pages/TaskPage/TaskPage';

import { Avatar } from './Avatar';
import { RoomFloor } from './RoomFloor';
import { RoomWall } from './RoomWall';
import { CanvasCamera } from './CanvasCamera';
import { Blur } from './Blur';

import InventoryIcon from './InventoryIcon';
import InventoryIconHover from './InventoryIconHover';
import InventoryMenu from './InventoryMenu';
import InventoryPreview from './InventoryPreview';

export default function GameCanvas() {
  const devMode = false;

  const user = useContext(UserContext);

  const CAM_FOV = 25;   // Camera field of view angle (degrees
  const CAM_POS_Y = 32; // Camera Y position
  const CAM_POS_Z = 3;  // Camera Z position
  const AV_ROT = 20;     // Avatar rotation (degrees)
  const AV_SCALE = 0.2;  // Avatar scale 

  const [camFov, setCamFov] = useState(CAM_FOV);
  const [camY, setCamY] = useState(CAM_POS_Y);
  const [camZ, setCamZ] = useState(CAM_POS_Z);
  const [tempZ, setTempZ] = useState(CAM_POS_Z);

  const [isLoaded, setIsLoaded] = useState(false);  // used for things that need canvas to be ready
  const [invHover, setInvHover] = useState(false);  // handle inventory icon state
  const [openInv, setOpenInv] = useState(false);    // handle opening inventroy menu

  // handle changing the icon when the user hovers over the inventory div
  function mouseInvActive(active: boolean) {
    // if the inventory is open, keep the open door icon 
    if (active == true || !openInv) {
      setInvHover(active);
    }
  }

  // updates once canvas is ready to render
  function canvasLoaded(loaded: boolean) {
    setIsLoaded(loaded);
  }

  // Creates menu items once canvas is loaded and ready to render
  function drawMenu(loaded: boolean) {
    if (loaded == true) {
      return (
        <div className={styles.inventoryBtnDiv}>
          {/* <InventoryBox /> */}
          <div className={styles.inventoryIconDiv}
            onMouseEnter={() => mouseInvActive(true)}
            onMouseLeave={() => mouseInvActive(false)}
            onClick={() => setOpenInv(!openInv)}>
            {invHover ? <InventoryIconHover /> : <InventoryIcon />}
          </div>
        </div>
      )
    }
  }

  // displays the customization items
  function drawInv(open: boolean) {
    if (open == true) {
      return (
        <>
          <InventoryMenu user={user as AuthUserData} />
        </>
      )
    }
  }

  // Testing changing the color / opacity of an object
  const colorChange = (event: any) => {
    const new_mat = event.object.material.clone();
    new_mat.color.setHex(0xA3C197);
    new_mat.transparent = true; // transparent must be "true" for opacity to do anything
    new_mat.opacity = Number(!event.object.material.opacity); // switches opacity between 0 and 1
    event.object.material = new_mat;
    event.object.needs_update = true;
  }

  // Camera: field of view input box
  function fovBox() {
    return (
      <label>
        FOV: <input id="fovCam" name="myInput" defaultValue={camFov}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              setCamFov(Number((event.target as HTMLInputElement).value));
            }
          }}
        />
      </label>
    )
  }

  function ySlide() {
    return (
      <label>
        Y POS: <input type="range" min="0" max="80" id="yCamS" name="slideY" value={camY}
          onChange={(event) => {
            setCamY(Number(event.target.value))
          }}
        />
      </label>
    );
  }

  // Camera: Y position input box
  function yBox() {
    return (
      <input id="yCamB" name="boxY" value={camY}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            setCamY(Number((event.target as HTMLInputElement).value));
          }
        }}
      />
    )
  }

  // Camera: Z position slider
  // if we want the box to update when the slider is changed, we need to use a temp 
  // variable for the "value" property
  function zSlide() {
    return (
      <label>
        Z POS: <input type="range" min="0" max="50" id="zCam" name="myInputZ" value={tempZ}
          onChange={(event) => {
            setCamZ(Number(event.target.value));
            setTempZ(Number(event.target.value));
          }
          } />
      </label>
    );
  }

  // Camera: Z position input box
  function zBox() {
    return (
      <input id="zCam" name="myInputZ" value={tempZ}
        onChange={(event) => { setTempZ(Number(event.target.value)); }}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            setCamZ(Number((event.target as HTMLInputElement).value));
          }
        }} />
    )
  }

  return (
    <div className={styles.gameCanvasDiv}>
      {devMode ? fovBox() : null}
      {devMode ? ySlide() : null}{devMode ? yBox() : null}
      {devMode ? zSlide() : null}{devMode ? zBox() : null}

      {/* CANVAS */}
      <div className={styles.gameCanvas}>
        <Canvas camera={{ position: [0, camY, camZ] }} onCreated={() => canvasLoaded(true)}>
          <ambientLight intensity={Math.PI / 1.5} />
          <spotLight position={[0, 10, 0]} angle={0.75} penumbra={1} decay={0} intensity={Math.PI} />
          <spotLight position={[0, 20, 10]} angle={0.5} penumbra={1} decay={0} intensity={Math.PI / 2} />
          {/* <pointLight position={[-10, -10, -10]} decay={10} intensity={Math.PI} /> */}

          <CanvasCamera camFov={camFov} camY={camY} camZ={camZ} />

          <RoomFloor />
          <RoomWall onClick={(e: any) => colorChange(e)} position={[0, 0, -5]} material={new THREE.MeshBasicMaterial({})} />
          <RoomWall onClick={(e: any) => colorChange(e)} position={[-5, 0, 0]} rotation={[0, THREE.MathUtils.degToRad(90), 0]} />
          <RoomWall onClick={(e: any) => colorChange(e)} position={[5, 0, 0]} rotation={[0, THREE.MathUtils.degToRad(-90), 0]} />
          <RoomWall onClick={(e: any) => colorChange(e)} position={[0, 0, 5]} />
          <Avatar position={[0, 0.01, 0]}
            rotation={[THREE.MathUtils.degToRad(-AV_ROT), THREE.MathUtils.degToRad(90), 0]}
            scale={[AV_SCALE, AV_SCALE, AV_SCALE]} />

          {openInv ? <Blur position={[0, 5, 0]} /> : null}

          <InventoryPreview doDress={openInv} />
        </Canvas>
      </div>

      {/* INVENTORY MENU */}
      {drawInv(openInv)}
      {drawMenu(isLoaded)}
    </div >
  )
}

