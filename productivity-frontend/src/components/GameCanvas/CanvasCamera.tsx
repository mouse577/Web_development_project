import { useFrame, useThree } from "@react-three/fiber"
import { PerspectiveCamera } from "three";

interface CanCam {
  camFov?: number;
  camX?: number;
  camY?: number;
  camZ?: number;
}

export function CanvasCamera(c: CanCam) {
  const { camera } = useThree();

  useFrame(() => { 
    let pChange:boolean = false;
    if (camera instanceof PerspectiveCamera) {


      if (typeof c.camFov === "number" && camera.fov != c.camFov) {
        // adjust Horizontal FOV
        camera.fov = Math.atan( Math.tan( c.camFov * Math.PI / 360 ) / camera.aspect ) * 360 / Math.PI;
        camera.updateProjectionMatrix();
      }

      if (typeof c.camX === "number" && camera.position.x != c.camX) {
        var newX:number = c.camX;
        pChange = true; 
      } else {
        var newX = camera.position.x;
      }

      if (typeof c.camY === "number" && camera.position.y != c.camY) {
        var newY:number = c.camY;
        pChange = true; 
      } else {
        var newY = camera.position.y;
      }

      if (typeof c.camZ === "number" && camera.position.z != c.camZ) {
        var newZ:number = c.camZ;
        pChange = true; 
      } else {
        var newZ = camera.position.z;
      }

      if (pChange) {
        console.log(camera.position)
        camera.position.set(newX, newY, newZ);
        camera.lookAt(0, 0, -0.5);
      }
    }
  });

  return null;
};
