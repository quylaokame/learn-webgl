class Renderer {

    constructor() {
        const canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        canvas.width = 800;
        canvas.height = 600;
        this.gl = canvas.getContext("webgl");

        const img = new Image();
        img.onload = () => {
            this.loadShaders("./vertex.vert", "./fragment.frag");
        };
        document.body.appendChild(img);
        img.src = "./img.png";
    }

    loadShaders(vsUrl, fsUrl){
        const loadPromises = [
            this.loadXHR(vsUrl),
            this.loadXHR(fsUrl)
        ];
        Promise.all(loadPromises)
            .then((results) => {
                const vsSource = results[0];
                const fsSource = results[1];
                this.initShader(vsSource, fsSource);
                this.draw();
            });
    }

    loadXHR(url) {
        const promise = new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if ((xhr.readyState === 4) && (xhr.status === 200)) {
                    resolve(xhr.responseText);
                    console.log(url.split("/").pop(), xhr.responseText);
                }
                xhr.onerror = function(){
                    reject(xhr.statusText);
                }
            };
            xhr.open("GET", url, true);
            xhr.send(null);
        });
        return promise;
    }

    initShader(vsSource, fsSource) {
        const gl = this.gl;
        const vs = this._createShader(gl.VERTEX_SHADER, vsSource);
        const fs = this._createShader(gl.FRAGMENT_SHADER, fsSource);
        this.program = this._createProgram(vs, fs);
    }
    
    _createShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    
    _createProgram( vertexShader, fragmentShader) {
        const gl = this.gl;
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    draw() {
        this.drawRectangle();
    }

    drawRectangle() {
        const gl = this.gl;
        const posAttr = "a_position";
        const positions = [
            0, 0,
            1, 0,
            0, 1,
            0, 1,
            1, 0,
            1, 1
        ]

        const positionBuffer = this._createArrayBuffer(positions, Float32Array, gl.STATIC_DRAW);
        this._bindBufferToAttribute(posAttr, positionBuffer);

        gl.useProgram(this.program);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    _createArrayBuffer(array, BinaryConstructor, usage){
        const gl = this.gl;
        usage = (usage === void 0) ? gl.STATIC_DRAW : usage;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new BinaryConstructor(array), usage);
        return buffer;
    }

    _bindBufferToAttribute(attribute, buffer, options){
        const gl = this.gl;
        const program = this.program;
        const opt = { size: 2, type: gl.FLOAT, normalized: false, stride: 0, offset: 0 };
        if (options) {
            Object.assign(opt, options);
        }
        const { size, type, normalized, stride, offset } = opt;
        const attrLocation = gl.getAttribLocation(program, attribute);
        gl.enableVertexAttribArray(attrLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(attrLocation, size, type, normalized, stride, offset);
    }

}

const renderer = new Renderer();




