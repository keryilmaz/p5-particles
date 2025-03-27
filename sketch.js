class Particle {
    constructor(x, y) {
      this.pos = createVector(x, y);
      this.vel = createVector(random(-1, 1), random(-1, 1));
      this.acc = createVector(0, 0);
      this.lifespan = 255;
      this.maxSpeed = 4;
      this.history = [];
      this.color = color(random(180, 250), 100, 100, this.lifespan);
    }

    applyForce(force) {
      this.acc.add(force);
    }

    update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.lifespan -= 1.5;

      this.history.push(this.pos.copy());
      if (this.history.length > 20) {
        this.history.splice(0, 1);
      }

      this.color.setAlpha(this.lifespan);
    }

    display() {
      noStroke();
      fill(this.color);
      ellipse(this.pos.x, this.pos.y, 4, 4);

      beginShape();
      noFill();
      stroke(this.color);
      strokeWeight(1);
      for (let v of this.history) {
        vertex(v.x, v.y);
      }
      endShape();
    }

    isDead() {
      return this.lifespan < 0;
    }

    edges() {
      if (this.pos.x > width + 10) this.pos.x = -10;
      if (this.pos.x < -10) this.pos.x = width + 10;
      if (this.pos.y > height + 10) this.pos.y = -10;
      if (this.pos.y < -10) this.pos.y = height + 10;
    }
}

let particles = [];
let noiseScale = 0.005;
let noiseStrength = 0.5;
let numParticles = 5000;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 255);
  
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0, 0, 0, 50);

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];

    let angle = noise(p.pos.x * noiseScale, p.pos.y * noiseScale, frameCount * 0.001) * TWO_PI * 2;
    let flowForce = p5.Vector.fromAngle(angle);
    flowForce.mult(noiseStrength);
    p.applyForce(flowForce);

    p.update();
    p.display();
    p.edges();

    if (p.isDead()) {
      particles.splice(i, 1);
    }
  }

  while (particles.length < numParticles) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function mousePressed() {
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(mouseX, mouseY));
  }
} 