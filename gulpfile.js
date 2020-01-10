const gulp = require("gulp");
const uglify = require("gulp-uglify");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const browserSync = require("browser-sync");
const gulpNodemon = require("gulp-nodemon");
const server = browserSync.create();

const babelifyConfig = {
  presets: ["@babel/preset-env"]
};

function styles() {
  return gulp
    .src(["frontend/src/scss/*.scss"])
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(gulp.dest("public"))
    .pipe(server.stream());
}

function copyHtml() {
  return gulp.src(["./frontend/*.html"]).pipe(gulp.dest("public/"));
}

function scripts() {
  return browserify({ debug: true })
    .transform(babelify.configure(babelifyConfig))
    .require("./frontend/src/js/index.js", { entry: true })
    .bundle()
    .on("error", swallowError)
    .pipe(source("index.js"))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest("./public"));
}

const watch = () => {
  gulp.watch("frontend/src/js/**/*.js", gulp.series(scripts, reload));
  gulp.watch("frontend/src/scss/**/*.scss", gulp.series(styles));
  gulp.watch("frontend/*.html").on("change", gulp.series(copyHtml, reload));
};

function reload(done) {
  server.reload();

  done();
}

const build = gulp.series(copyHtml, styles, scripts);

function serve(done) {
  server.init(null, {
    proxy: "localhost:3333",
    files: ["public/**/*"],
    browser: "google chrome",
    port: 5000,
    notify: true
  });

  done();
}

function nodemon(done) {
  var started = false;

  return gulpNodemon({
    script: "server.mjs",
    ignore: ["gulpfile.js", "config/", "node_modules/"]
  }).on("start", function() {
    if (!started) {
      started = true;
      done();
    }
  });
}

const dev = gulp.series(build, nodemon, gulp.parallel(watch, serve));

function swallowError(error) {
  console.log(error.toString());
  this.emit("end");
}

exports.default = dev;
