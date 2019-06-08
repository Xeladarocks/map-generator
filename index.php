
<body style="margin:0" onresize="windowResize()">
    <div style="position:absolute;display:inline;top:200px">
        <label for="moisture-input">Canvas Size:</label>
        <input oninput="resizeCanv(this.value)" onchange="resizeCanv(this.value)" id="canvas-input" type="range" min="200" max="900" step="100" value="500" />
    </div>
    <canvas id="canvas" style="cursor: grab"></canvas>
    <div style="position:absolute;display:inline;top:200px">
        <span id="elevation-display"></span><span id="biome-display"></span>
    </div>
</body>

<script src="stats.min.js"></script>
<script src="perlin.js"></script>
<script src="simplex-noise.js"></script>
<script src="generation.js"></script>