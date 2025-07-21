<template>
  <canvas ref="canvasRef" class="w-full h-full border-none block" />
</template>

<script setup lang="ts">
const colorMode = useColorMode();

import { ref, onMounted, onUnmounted, watch } from "vue";
type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern;

interface GridOffset {
  x: number;
  y: number;
}

interface Props {
  direction?: "diagonal" | "up" | "right" | "down" | "left";
  speed?: number;
  borderColor?: CanvasStrokeStyle;
  squareSize?: number;
  hoverFillColor?: CanvasStrokeStyle;
}

const props = withDefaults(defineProps<Props>(), {
  direction: "right",
  speed: 1,
  borderColor: "#999",
  squareSize: 40,
  hoverFillColor: "#222",
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const requestRef = ref<number | null>(null);
const numSquaresX = ref<number>(0);
const numSquaresY = ref<number>(0);
const gridOffset = ref<GridOffset>({ x: 0, y: 0 });
const hoveredSquareRef = ref<GridOffset | null>(null);

let ctx: CanvasRenderingContext2D | null = null;

const resizeCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  numSquaresX.value = Math.ceil(canvas.width / props.squareSize) + 1;
  numSquaresY.value = Math.ceil(canvas.height / props.squareSize) + 1;
};

const drawGrid = () => {
  const canvas = canvasRef.value;
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const startX = Math.floor(gridOffset.value.x / props.squareSize) * props.squareSize;
  const startY = Math.floor(gridOffset.value.y / props.squareSize) * props.squareSize;

  for (let x = startX; x < canvas.width + props.squareSize; x += props.squareSize) {
    for (let y = startY; y < canvas.height + props.squareSize; y += props.squareSize) {
      const squareX = x - (gridOffset.value.x % props.squareSize);
      const squareY = y - (gridOffset.value.y % props.squareSize);

      if (
        hoveredSquareRef.value &&
        Math.floor((x - startX) / props.squareSize) === hoveredSquareRef.value.x &&
        Math.floor((y - startY) / props.squareSize) === hoveredSquareRef.value.y
      ) {
        ctx.fillStyle = props.hoverFillColor;
        ctx.fillRect(squareX, squareY, props.squareSize, props.squareSize);
      }

      ctx.strokeStyle = props.borderColor;
      ctx.strokeRect(squareX, squareY, props.squareSize, props.squareSize);
    }
  }

  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
  );
  gradient.addColorStop(0, colorMode.value === "dark" ? "rgba(0, 0, 0, 0)" : "rgba(255, 255, 255, 0)");
  gradient.addColorStop(1, colorMode.value === "dark" ? "#0b0b0b" : "#fff");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const updateAnimation = () => {
  const effectiveSpeed = Math.max(props.speed, 0.1);

  switch (props.direction) {
    case "right":
      gridOffset.value.x = (gridOffset.value.x - effectiveSpeed + props.squareSize) % props.squareSize;
      break;
    case "left":
      gridOffset.value.x = (gridOffset.value.x + effectiveSpeed + props.squareSize) % props.squareSize;
      break;
    case "up":
      gridOffset.value.y = (gridOffset.value.y + effectiveSpeed + props.squareSize) % props.squareSize;
      break;
    case "down":
      gridOffset.value.y = (gridOffset.value.y - effectiveSpeed + props.squareSize) % props.squareSize;
      break;
    case "diagonal":
      gridOffset.value.x = (gridOffset.value.x - effectiveSpeed + props.squareSize) % props.squareSize;
      gridOffset.value.y = (gridOffset.value.y - effectiveSpeed + props.squareSize) % props.squareSize;
      break;
    default:
      break;
  }

  drawGrid();
  requestRef.value = requestAnimationFrame(updateAnimation);
};

const handleMouseMove = (event: MouseEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const startX = Math.floor(gridOffset.value.x / props.squareSize) * props.squareSize;
  const startY = Math.floor(gridOffset.value.y / props.squareSize) * props.squareSize;

  const hoveredSquareX = Math.floor((mouseX + gridOffset.value.x - startX) / props.squareSize);
  const hoveredSquareY = Math.floor((mouseY + gridOffset.value.y - startY) / props.squareSize);

  if (
    !hoveredSquareRef.value ||
    hoveredSquareRef.value.x !== hoveredSquareX ||
    hoveredSquareRef.value.y !== hoveredSquareY
  ) {
    hoveredSquareRef.value = { x: hoveredSquareX, y: hoveredSquareY };
  }
};

const handleMouseLeave = () => {
  hoveredSquareRef.value = null;
};

const initializeCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  ctx = canvas.getContext("2d");
  resizeCanvas();

  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseleave", handleMouseLeave);
  window.addEventListener("resize", resizeCanvas);

  requestRef.value = requestAnimationFrame(updateAnimation);
};

const cleanup = () => {
  const canvas = canvasRef.value;

  if (requestRef.value) {
    cancelAnimationFrame(requestRef.value);
    requestRef.value = null;
  }

  if (canvas) {
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mouseleave", handleMouseLeave);
  }

  window.removeEventListener("resize", resizeCanvas);
};

onMounted(() => {
  initializeCanvas();
});

onUnmounted(() => {
  cleanup();
});

watch(
  [
    () => props.direction,
    () => props.speed,
    () => props.borderColor,
    () => props.hoverFillColor,
    () => props.squareSize,
  ],
  () => {
    cleanup();
    initializeCanvas();
  }
);
</script>
