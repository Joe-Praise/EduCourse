const dev = {
  devUrl: `http://localhost:${import.meta.env.VITE_PORT || 3050}`,
  prodUrl:
    import.meta.env.VITE_PRODUCTION_URL || "https://educourse.onrender.com",
};

const urlPath =
  import.meta.env.VITE_MODE === "prod"
    ? "https://edu-course.vercel.app"
    : "http://localhost:5174";
const userConstant = "profile";
const mode = import.meta.env.VITE_MODE || "dev";
const ModeConstants = {
  dev: "dev",
  prod: "prod",
};

const config = {
  userConstant,
  ...dev,
  urlPath,
  mode,
  ModeConstants,
};

export default config;
