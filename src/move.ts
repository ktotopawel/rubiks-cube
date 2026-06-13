import { Group, type Mesh, type Scene } from "three";

export interface Move {
  axis: "x" | "y" | "z";
  slice: number;
  rotation: number;
}

const scramble = async (
  scene: Scene,
  allCubes: Mesh[],
  moveCount = 10,
): Promise<Move[]> => {
  const history: Move[] = [];
  const axes: ("x" | "y" | "z")[] = ["x", "y", "z"];
  const slices = [-1, 0, 1];
  const rotations = [Math.PI / 2, -Math.PI / 2];

  for (let i = 0; i < moveCount; i++) {
    const axis = axes[Math.floor(Math.random() * 3)];
    const slice = slices[Math.floor(Math.random() * 3)];
    const rotation = rotations[Math.floor(Math.random() * 2)];
    history.push({ axis, slice, rotation });
  }

  for (const m of history) {
    await move(scene, m, allCubes);
  }

  return history;
};

const solve = async (scene: Scene, allCubes: Mesh[], history: Move[]) => {
  const reverseHistory = history
    .slice()
    .reverse()
    .map((m) => ({
      ...m,
      rotation: -m.rotation,
    }));

  for (const m of reverseHistory) {
    await move(scene, m, allCubes);
  }
};

const move = (scene: Scene, move: Move, allCubes: Mesh[]): Promise<void> => {
  return new Promise((resolve) => {
    const { axis, slice, rotation } = move;

    const pivot = new Group();
    scene.add(pivot);

    const activeCubes = allCubes.filter((c) => {
      const normalizedPos = Math.round(c.position[axis] / 1.05);
      return normalizedPos === slice;
    });

    activeCubes.forEach((c) => pivot.attach(c));

    const duration = 300;
    const startRotation = pivot.rotation[axis];
    const endRotation = startRotation + rotation;
    const startTime = performance.now();

    function animate() {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      pivot.rotation[axis] =
        startRotation + (endRotation - startRotation) * progress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        pivot.updateMatrixWorld();

        activeCubes.forEach((c) => scene.attach(c));
        scene.remove(pivot);

        resolve();
      }
    }

    animate();
  });
};

export { scramble as scrambleFn, solve as solveFn };
