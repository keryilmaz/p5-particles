class Particle {
    constructor(x, y) {
      this.pos = createVector(x, y);
      this.vel = createVector(random(-1, 1), random(-1, 1));
      this.acc = createVector(0, 0);
      this.maxSpeed = random(1, 3.5);
      this.size = random(1.5, 4.5);
      this.baseLifespan = random(150, 350);
      this.lifespan = this.baseLifespan;
      let hue = random(180, 280);
      let saturation = random(30, 70);
      let brightness = random(50, 90);
      this.color = color(hue, saturation, brightness, this.lifespan);
    }

    applyForce(force) {
      this.acc.add(force);
    }

    update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.lifespan -= 1.0;

      let alpha = map(this.lifespan, 0, this.baseLifespan, 0, 255);
      this.color.setAlpha(alpha);
    }

    display() {
      noStroke();
      fill(this.color);
      ellipse(this.pos.x, this.pos.y, this.size, this.size);
    }

    isOffScreen() {
        let margin = this.size * 5;
        return (this.pos.x < -margin || this.pos.x > width + margin ||
                this.pos.y < -margin || this.pos.y > height + margin);
    }

    reset() {
        this.pos = createVector(random(width), random(height));
        this.vel = p5.Vector.random2D().mult(this.maxSpeed * random(0.1, 0.5));
        this.acc = createVector(0, 0);
        this.lifespan = this.baseLifespan;

        let hue = random(180, 280);
        let saturation = random(30, 70);
        let brightness = random(50, 90);
        this.color = color(hue, saturation, brightness, this.lifespan);
    }
}

let particles = [];
let noiseScale = 0.003;
let noiseStrength = 0.3;
let timeScale = 0.0008;
let numParticles = 4000;

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
  background(240, 30, 10, 30);

  let time = frameCount * timeScale;

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    let angle = noise(p.pos.x * noiseScale, p.pos.y * noiseScale, time) * TWO_PI * 4;
    let flowForce = p5.Vector.fromAngle(angle);
    flowForce.mult(noiseStrength);
    p.applyForce(flowForce);

    p.update();
    p.display();

    if (p.lifespan < 0 || p.isOffScreen()) {
      p.reset();
    }
  }
}

function mousePressed() {
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(mouseX, mouseY));
  }
} 