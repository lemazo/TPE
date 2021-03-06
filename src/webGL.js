var canvas;
var gl;

var cabaneVerticesBuffer;
var cabaneVerticesColorBuffer;
var cabaneVerticesIndexBuffer;

var cabaneVerticesTextureCoordBuffer;

var cubeVerticesBuffer;
var cubeVerticesColorBuffer;
var cubeVerticesIndexBuffer;


var colors;

var cielTexture;
var cielImage;

var solTexture;
var solImage;

var terasseImage;
var terasseTexture;

var pan0Image; var pan0Texture;
var pan1Image; var pan1Texture;
var pan2Image; var pan2Texture;
var pan3Image; var pan3Texture;
var pan4Image; var pan4Texture;
var pan5Image; var pan5Texture;

var cubeRotation = 0.0;

var mvMatrix;
var shaderProgramCabane;
var shaderProgramCube;
var vertexPositionAttribute;
var vertexColorAttribute;
var cameraMatrix;

var angle = -90;
var sens = true;

var ancien_x;
var ancien_y;
var D_ANGLE=0.04;
var tetha=0;
var alpha=0.0;
var distance=100.0; 
var posX = 0; 
var posY = 1.5;
var posZ = 5;
var lookX = 0;
var lookY = 1.5;
var lookZ = 0;

var mvMatrixStack = [];

var tabCabane;
var seed;

appelPhp();

//
// start
//
// Called when the canvas is created to get the ball rolling.
// Figuratively, that is. There's nothing moving in this demo.
//
function start() {
  canvas = document.getElementById("glcanvas");
  canvas.addEventListener("mousemove",souris);
  document.addEventListener("keydown",keyboard);

  initWebGL(canvas);      // Initialise GL context

  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things


	// On lance l'initialisation des buffers et des shaders
    initShaders();
    initBuffers();
    initTextures();

    // On affiche la scene avec un frame rate à 35FPS
    drawScene();
  }
}

//
// initWebGL
//
// on initialise WebGL dans avec la variable gl
//

function initWebGL() {
  gl = null;

  try {
    gl = canvas.getContext("experimental-webgl");
  }
  catch(e) {
  }

  // Si WebGL ne fonctionne pas

  if (!gl) {
    alert("Impossible d'initialiser WebGL, veuillez verifier la compatibilité de votre navigateur.");
  }
}

//
// initBuffers
//
// initialise les buffers tel que cabane ou cube
//

function initBuffers() {

	//CABANE
	{
		cabaneVerticesBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cabaneVerticesBuffer);
		var d = 0.5;
		var vertices = [
			// Front face
			//First Pane
			-d,  d,  d,		//A
			 0,  d,  d,		//B
			 0, -d,  d,		//E
			-d, -d,  d,		//F
			//Second Pane
			 0,  d,  d,		//B
			 d,  d,  d,		//C
			 d, -d,  d,		//D
			 0, -d,  d,		//E
			// Right Face
			// First Pane
			 d,  d,  d,		//C
			 d,  d,  0,		//H
			 d, -d,  0,		//I
			 d, -d,  d,		//D
			// Second Pane
			 d,  d,  0,		//H
			 d,  d, -d,		//M
			 d, -d, -d,		//N
			 d, -d,  0,		//I
			// Back Face
			// First Pane
			 d,  d, -d,		//M
			 0,  d, -d,		//L
			 0, -d, -d,		//O
			 d, -d, -d,		//N
			// Seconde Pane
			 0,  d, -d,		//L
			-d,  d, -d,		//P
			-d, -d, -d,		//K
			 0, -d, -d,		//O
			// Left Face
			// First Pane
			-d,  d, -d,		//P
			-d,  d,  0,		//G
			-d, -d,  0,		//J
			-d, -d, -d,		//K
			// Second Pane
			-d,  d,  d,		//A
			-d,  d,  0,		//G
			-d, -d,  0,		//J
			-d, -d,  d,		//F
			// Top face
			-d,  d,  d,		//A
			 d,  d,  d,		//C
			 d,  d, -d,		//M
			-d,  d, -d,		//K
			// Bottom face
			-d, -d,  d,		//F
			 d, -d,  d,		//D
			 d, -d, -d,		//N
			-d, -d, -d		//P

		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		colors = [];
		colors['a']=[1.0,  0.0,  0.0,  1.0];//RED 
		colors['b']=[1.0,  0.3,  0.0,  1.0];//ORANGE
		colors['c']=[1.0,  0.9,  0.0,  1.0];//YELLOW
		colors['d']=[0.0,  0.5,  0.2,  1.0];//GREEN
		colors['e']=[0.0,  0.0,  1.0,  1.0];//BLUE
		colors['f']=[0.3,  0.0,  0.5,  1.0];//PURPLE
		colors['g']=[0.5,  0.8,  0.8,  1.0];//BLUE GREY
		colors['h']=[0.9,  0.7,  0.9,  1.0];//PASTEL PINK
		colors['i']=[0.3,  0.3,  0.5,  1.0];//PASTEL MARINE
		colors['j']=[0.5,  0.5,  0.5,  1.0];//GREY
		
		
		// Build the element array buffer; this specifies the indices
		// into the vertex array for each face's vertices.

		cabaneVerticesIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cabaneVerticesIndexBuffer);

		// This array defines each face as two triangles, using the
		// indices into the vertex array to specify each triangle's
		// position.

		var cabaneVertexIndices = [
			0, 1, 2,	 0, 2, 3,	 4, 5, 6,	 4, 6, 7,	// Front
			8, 9,10,	 8,10,11,	12,14,15,	12,13,14,	// Right
			16,17,18,	16,18,19,	20,21,22,	20,22,23,	// Back
			24,25,26,	24,26,27,	28,29,30,	28,30,31,	// Left
			32,33,34,	32,34,35,							// Top
			36,37,38,	36,38,39							// Bottom
		]

		// Now send the element array to GL

		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
		new Uint16Array(cabaneVertexIndices), gl.STATIC_DRAW);
		
		cabaneVerticesTextureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cabaneVerticesTextureCoordBuffer);

		var textureCabaneCoordinates = [
			// Front p1
			0.0,  	0.0,
			1.0, 	0.0,
			1.0,	1.0,
			0.0,  	1.0,
			// Front p2
			0.0,  	0.0,
			1.0, 	0.0,
			1.0,	1.0,
			0.0,  	1.0,
			// Right p1
			0.0,  	0.0,
			1.0, 	0.0,
			1.0,	1.0,
			0.0,  	1.0,
			// Right p2
			0.0,  	0.0,
			1.0, 	0.0,
			1.0,	1.0,
			0.0,  	1.0,
			// Back p1
			0.0,  	0.0,
			1.0, 	0.0,
			1.0,	1.0,
			0.0,  	1.0,
			// Back p2
			0.0,  	0.0,
			1.0, 	0.0,
			1.0,	1.0,
			0.0,  	1.0,
			// Left p1
			0.0,  	0.0,
			1.0, 	0.0,
			1.0,	1.0,
			0.0,  	1.0,
			// Left p2
			0.0,  	0.0,
			1.0, 	0.0,
			1.0,	1.0,
			0.0,  	1.0,
			// Top
			0.0,  	0.0,
			1.0, 	0.0,
			1.0,	1.0,
			0.0,  	1.0,
			// Bottom
			0.0,  	0.0,
			1.0, 	0.0,
			1.0,	1.0,
			0.0,  	1.0
			
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCabaneCoordinates),
			gl.STATIC_DRAW);
		
	}

	//CUBE STANDARD
	{
		cubeVerticesBuffer = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);

		var vertices = [
			// Front face
			-1.0, -1.0,  1.0,
			1.0, -1.0,  1.0,
			1.0,  1.0,  1.0,
			-1.0,  1.0,  1.0,
	
			// Back face
			-1.0, -1.0, -1.0,
			-1.0,  1.0, -1.0,
			1.0,  1.0, -1.0,
			1.0, -1.0, -1.0,
	
			// Top face
			-1.0,  1.0, -1.0,
			-1.0,  1.0,  1.0,
			1.0,  1.0,  1.0,
			1.0,  1.0, -1.0,
	
			// Bottom face
			-1.0, -1.0, -1.0,
			1.0, -1.0, -1.0,
			1.0, -1.0,  1.0,
			-1.0, -1.0,  1.0,
	
			// Right face
			1.0, -1.0, -1.0,
			1.0,  1.0, -1.0,
			1.0,  1.0,  1.0,
			1.0, -1.0,  1.0,
	
			// Left face
			-1.0, -1.0, -1.0,
			-1.0, -1.0,  1.0,
			-1.0,  1.0,  1.0,
			-1.0,  1.0, -1.0
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		cubeVerticesTexturePatronCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTexturePatronCoordBuffer);

		//Coordonnée texture patron

		 var texturePatronCoordinates = [
			// Front
			0.25, 0.5,
			0.5,  0.5,
			0.5,  0.25,
			0.25, 0.25,
			// Back
			1.0,  0.5,
			1.0,  0.25,
			0.75, 0.25,
			0.75, 0.5,
			// Top
			0.25, 0.001, //0.001 rustine pour le ciel
			0.25, 0.25,
			0.5,  0.25,
			0.5,  0.001, //0.001 rustine pour le ciel
			// Bottom
			0.25, 0.75,
			0.5,  0.75,
			0.5,  0.5,
			0.25, 0.5,
			// Right
			0.75, 0.5,
			0.75, 0.25,
			0.5,  0.25,
			0.5,  0.5,
			// Left
			0.0,  0.5,
			0.25, 0.5,
			0.25, 0.25,
			0.0,  0.25
		  ];
		  
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texturePatronCoordinates),
			gl.STATIC_DRAW);
		  
		cubeVerticesTextureRepeteCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureRepeteCoordBuffer);

		var textureRepeteCoordinates = [
			// Front
			0.0,  	0.0,
			1000.0, 0.0,
			1000.0,	1000.0,
			0.0,  	1000.0,
			// Back
			0.0,  	0.0,
			1000.0, 0.0,
			1000.0, 1000.0,
			0.0,  	1000.0,
			// Top
			0.0,  	0.0,
			1000.0, 0.0,
			1000.0,	1000.0,
			0.0,  	1000.0,
			// Bottom
			0.0,  	0.0,
			1000.0, 0.0,
			1000.0,	1000.0,
			0.0,  	1000.0,
			// Right
			0.0,  	0.0,
			1000.0, 0.0,
			1000.0,	1000.0,
			0.0,  	1000.0,
			// Left
			0.0,  	0.0,
			1000.0, 0.0,
			1000.0,	1000.0,
			0.0,  	1000.0,
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureRepeteCoordinates),
			gl.STATIC_DRAW);

		cubeVerticesIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);


		var cubeVertexIndices = [
			0,  1,  2,      0,  2,  3,    // front
			4,  5,  6,      4,  6,  7,    // back
			8,  9,  10,     8,  10, 11,   // top
			12, 13, 14,     12, 14, 15,   // bottom
			16, 17, 18,     16, 18, 19,   // right
			20, 21, 22,     20, 22, 23    // left
		]

		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
		new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);

  }

}

//
// Initialisation des textures
//
function initTextures() {
	cielTexture = gl.createTexture();
	cielImage = new Image();
	cielImage.onload = function() { handleTextureLoaded(cielImage, cielTexture); }
	cielImage.src = "rsc/ciel.png";

	solTexture = gl.createTexture();
	solImage = new Image();
	solImage.onload = function() { handleTextureLoaded(solImage, solTexture); }
	solImage.src = "rsc/sol.png";
	
	terasseTexture = gl.createTexture();
	terasseImage = new Image();
	terasseImage.onload = function() { handleTextureLoaded(terasseImage, terasseTexture); }
	terasseImage.src = "rsc/terasse.png";
	
	pan0Texture = gl.createTexture();
	pan0Image = new Image();
	pan0Image.onload = function() { handleTextureLoaded(pan0Image, pan0Texture); }
	pan0Image.src = "rsc/pan0.png";
	
	pan1Texture = gl.createTexture();
	pan1Image = new Image();
	pan1Image.onload = function() { handleTextureLoaded(pan1Image, pan1Texture); }
	pan1Image.src = "rsc/pan1.png";                         
	                                                        
	pan2Texture = gl.createTexture();                       
	pan2Image = new Image();                                
	pan2Image.onload = function() { handleTextureLoaded(pan2Image, pan2Texture); }
	pan2Image.src = "rsc/pan2.png";                         
	                                                        
	pan3Texture = gl.createTexture();                       
	pan3Image = new Image();                                
	pan3Image.onload = function() { handleTextureLoaded(pan3Image, pan3Texture); }
	pan3Image.src = "rsc/pan3.png";                         
	                                                        
	pan4Texture = gl.createTexture();                       
	pan4Image = new Image();                                
	pan4Image.onload = function() { handleTextureLoaded(pan4Image, pan4Texture); }
	pan4Image.src = "rsc/pan4.png";                         
	                                                        
	pan5Texture = gl.createTexture();                       
	pan5Image = new Image();                                
	pan5Image.onload = function() { handleTextureLoaded(pan5Image, pan5Texture); }
	pan5Image.src = "rsc/pan5.png";

}

function handleTextureLoaded(image, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

//
// drawScene
//
// Draw the scene.
//
function drawScene() {
	// Clear the canvas before we start drawing on it.

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	
	loadIdentity();
	
	//mvRotate(angle,[0,1,0]);
	
	lookX = distance * Math.sin(tetha) * Math.cos(alpha) + posX;
	lookZ = distance * Math.sin(tetha) * Math.sin(alpha) + posZ;
	lookY = distance * Math.cos(tetha) + posY;

	var projectionMatrix = makePerspective(100, 1280/720, 0.2, 100000.0);
	var lookMatrix = makeLookAt(posX, posY, posZ, lookX, lookY, lookZ, 0.0,1.0,0.0);
	
	cameraMatrix = projectionMatrix;
	cameraMatrix = cameraMatrix.multiply(lookMatrix);
	
	tabCabane.forEach(function(c) {
		activeCabaneShader();
		mvPushMatrix();
			mvTranslate([c.x, 1.5, c.y]);
			mvScale([2,2,2]);
			afficherCabane(c.texture);
		mvPopMatrix();
		mvPushMatrix();
			(c.orientation=="s")?mvTranslate([c.x+2,0.5,c.y]):mvTranslate([c.x,0.5,c.y+2]);
			activeTextureShader();
			mvScale([1,0.05,1]);
			afficheTerasse();
		mvPopMatrix();
	});

	activeTextureShader();
	mvPushMatrix();
		mvScale([1000,1000,1000]);
		afficherCiel();
	mvPopMatrix();
	
	mvPushMatrix();
		mvTranslate([0,-0.5,0]);
		mvScale([1000,1,1000]);
		afficherSol();
	mvPopMatrix();

}

function afficherCiel(){
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTexturePatronCoordBuffer);
	gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, cielTexture);
	gl.uniform1i(gl.getUniformLocation(shaderProgramCube, "uSampler"), 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
	setMatrixUniforms(shaderProgramCube);
	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

}

function afficheTerasse(){
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTexturePatronCoordBuffer);
	gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, terasseTexture);
	gl.uniform1i(gl.getUniformLocation(shaderProgramCube, "uSampler"), 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
	setMatrixUniforms(shaderProgramCube);
	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}

function afficherSol(){
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureRepeteCoordBuffer);
	gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, solTexture);
	gl.uniform1i(gl.getUniformLocation(shaderProgramCube, "uSampler"), 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
	setMatrixUniforms(shaderProgramCube);
	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

}

function afficherCabane(textureCabane){
	
	var generatedColors = [];
	for (var j=0; j<8; j++) {
		var lettre = textureCabane[j*2];
		var c = colors[lettre];
		for (var i=0; i<4; i++) {
			generatedColors = generatedColors.concat(c);
		}
	}
	for (var i=0; i<8; i++) {
		generatedColors = generatedColors.concat([0.0,0.0,0.0,1.0]);
	}
	
	cabaneVerticesColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cabaneVerticesColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatedColors), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cabaneVerticesBuffer);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cabaneVerticesColorBuffer);
	gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cabaneVerticesTextureCoordBuffer);
	gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cabaneVerticesIndexBuffer);
	setMatrixUniforms(shaderProgramCabane);
	
	for(var i=0;i<10;i++){
		gl.activeTexture(gl.TEXTURE0);
			var numero = textureCabane[i*2+1];
			
			switch(numero){
				case "1": gl.bindTexture(gl.TEXTURE_2D, pan0Texture);break;
				case "2": gl.bindTexture(gl.TEXTURE_2D, pan1Texture);break;
				case "3": gl.bindTexture(gl.TEXTURE_2D, pan2Texture);break;
				case "4": gl.bindTexture(gl.TEXTURE_2D, pan3Texture);break;
				case "5": gl.bindTexture(gl.TEXTURE_2D, pan4Texture);break;
				case "6": gl.bindTexture(gl.TEXTURE_2D, pan5Texture);break;
			}
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 2*i*6);
	}
}

//
// initShaders
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initShaders() { //TODO
  var fragmentShader = getShader(gl, "shader-fs-cabane");
  var vertexShader = getShader(gl, "shader-vs-cabane");

  // Create the shader program

  shaderProgramCabane = gl.createProgram();
  gl.attachShader(shaderProgramCabane, vertexShader);
  gl.attachShader(shaderProgramCabane, fragmentShader);
  gl.linkProgram(shaderProgramCabane);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgramCabane, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }
  
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  
  var fragmentShaderC = getShader(gl, "shader-fs-cube");
  var vertexShaderC = getShader(gl, "shader-vs-cube");

  // Create the shader program

  shaderProgramCube = gl.createProgram();
  gl.attachShader(shaderProgramCube, vertexShaderC);
  gl.attachShader(shaderProgramCube, fragmentShaderC);
  gl.linkProgram(shaderProgramCube);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgramCube, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
  }
}

function activeCabaneShader(){
	gl.useProgram(shaderProgramCabane);

	vertexPositionAttribute = gl.getAttribLocation(shaderProgramCabane, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);

	vertexColorAttribute = gl.getAttribLocation(shaderProgramCabane, "aVertexColor");
	gl.enableVertexAttribArray(vertexColorAttribute);
	
	textureCoordAttribute = gl.getAttribLocation(shaderProgramCube, "aTextureCoord");
	gl.enableVertexAttribArray(textureCoordAttribute);

}

function activeTextureShader(){
	gl.useProgram(shaderProgramCube);

	vertexPositionAttribute = gl.getAttribLocation(shaderProgramCube, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);

	textureCoordAttribute = gl.getAttribLocation(shaderProgramCube, "aTextureCoord");
	gl.enableVertexAttribArray(textureCoordAttribute);
}

//
// getShader
//
// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
//
function getShader(gl, id) {
  var shaderScript = document.getElementById(id);

  // Didn't find an element with the specified ID; abort.

  if (!shaderScript) {
    return null;
  }

  // Walk through the source element's children, building the
  // shader source string.

  var theSource = "";
  var currentChild = shaderScript.firstChild;

  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }

    currentChild = currentChild.nextSibling;
  }

  // Now figure out what type of shader script we have,
  // based on its MIME type.

  var shader;

  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  // Unknown shader type
  }

  // Send the source to the shader object

  gl.shaderSource(shader, theSource);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}


//
// Entrée sortie clavier
//

function souris(event)
{	
	var x = event.clientX;
	var y = event.clientY;
	
	var dx,dy;

	dx=x-ancien_x;
	dy=y-ancien_y;

	if(dx<0) alpha -= D_ANGLE;
	else if(dx>0) alpha += D_ANGLE;
	if(dy>0 && tetha <=Math.PI) tetha += D_ANGLE;
	else if(dy<0 && tetha>= 0) tetha -= D_ANGLE;
		
	ancien_x=x;
	ancien_y=y;
 
	drawScene();
}

function keyboard(key, x, y){
	
	var vecteurX = lookX - posX;
	var vecteurZ = lookZ - posZ;
	
	var norme = Math.sqrt(vecteurX*vecteurX+vecteurZ*vecteurZ);
	vecteurX /= norme;
	vecteurZ /= norme;
	
	var vecteurPerpendiculaireX = -vecteurZ;
	var vecteurPerpendiculaireZ = vecteurX;
	var pas = 0.2;
	
	switch(key.keyCode){
	case 90 : 
		if(vecteurZ<0 || vecteurZ > 0){
			posZ += vecteurZ * pas;
			lookZ += vecteurZ * pas;
		} 
		if(vecteurX<0 || vecteurX > 0){
			posX += vecteurX * pas; 
			lookX += vecteurX * pas;
		}
		break;
	case 83 : 
		if(-vecteurZ<0 || -vecteurZ > 0 ){
			posZ -= vecteurZ * pas;
			lookZ -= vecteurZ * pas; 
		 }
		 if(-vecteurX<0 || -vecteurX > 0){
			posX -= vecteurX * pas;
			lookX -= vecteurX * pas;
		}
		break;
	case 81 : 
		if(-vecteurPerpendiculaireZ<0 || -vecteurPerpendiculaireZ > 0 ){
			posZ -= vecteurPerpendiculaireZ * pas;
			lookZ -= vecteurPerpendiculaireZ * pas;
		 }
		 if(-vecteurPerpendiculaireX<0 || -vecteurPerpendiculaireX > 0){
			posX -= vecteurPerpendiculaireX * pas; 
			lookX -= vecteurPerpendiculaireX * pas;
		}
		break;
	case 68 : 
		if(vecteurPerpendiculaireZ<0 || vecteurPerpendiculaireZ > 0 ){
			posZ += vecteurPerpendiculaireZ * pas;
			lookZ += vecteurPerpendiculaireZ * pas;  
		}
		if(vecteurPerpendiculaireX<0 || vecteurPerpendiculaireX > 0){
			posX += vecteurPerpendiculaireX * pas;
			lookX += vecteurPerpendiculaireX * pas;
		}
		break;
	case 32 : 	
		posY += pas;
		lookY+= pas;
		break;
	case 17 :
		if(posY > 1.6){
			posY -= pas;
			lookY-= pas;
		}
		break;
	default : console.log(key.keyCode);
	}

	drawScene();
}

//
// Matrix utility functions
//

function loadIdentity() {
	mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
	mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}


function mvRotate(angle, v) {
	var inRadians = angle * Math.PI / 180.0;

	var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
	multMatrix(m);
}

function mvScale(v){
	
	var m = Matrix.Scaling($V([v[0], v[1], v[2]])).ensure4x4();
	multMatrix(m);
}

function setMatrixUniforms(program) {
	var pUniform = gl.getUniformLocation(program, "uPMatrix");
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(cameraMatrix.flatten()));

	var mvUniform = gl.getUniformLocation(program, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}

function mvPushMatrix(m) {
	if (m) {
		mvMatrixStack.push(m.dup());
		mvMatrix = m.dup();
	} else {
		mvMatrixStack.push(mvMatrix.dup());
	}
}

function mvPopMatrix() {
	if (!mvMatrixStack.length) {
		throw("Can't pop from an empty matrix stack.");
	}

	mvMatrix = mvMatrixStack.pop();
	return mvMatrix;
}
