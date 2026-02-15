document.querySelector("form")?.addEventListener("submit", e => {
  e.preventDefault();
  alert("Thanks! We'll be in touch shortly.");
});

// Animated Counter for Performance Metrics
class AnimatedCounter {
  constructor(element, target, duration = 2000) {
    this.element = element;
    this.target = parseInt(target);
    this.duration = duration;
    this.hasAnimated = false;
  }

  reset() {
    this.hasAnimated = false;
    this.element.textContent = '0';
  }

  animate() {
    if (this.hasAnimated) return;
    this.hasAnimated = true;

    const startTime = performance.now();
    const startValue = 0;

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      
      // Easing function for smooth animation (easeOutQuart)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (this.target - startValue) * easeOutQuart);
      
      this.element.textContent = currentValue.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        this.element.textContent = this.target.toLocaleString();
      }
    };

    requestAnimationFrame(updateCounter);
  }
}

// Initialize metrics animations
document.addEventListener('DOMContentLoaded', () => {
  const metricsSection = document.querySelector('.metrics-section');
  if (!metricsSection) return;

  const counters = [];
  const metricBoxes = metricsSection.querySelectorAll('.metric-box');
  const progressBars = metricsSection.querySelectorAll('.progress-fill');

  // Create counter instances
  metricsSection.querySelectorAll('.metric-number').forEach(el => {
    const target = el.getAttribute('data-target');
    counters.push(new AnimatedCounter(el, target, 2500));
  });

  // Function to trigger animations
  function triggerAnimations() {
    // Animate all counters
    counters.forEach(counter => counter.animate());
    
    // Animate progress bars with stagger
    progressBars.forEach((bar, index) => {
      setTimeout(() => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = progress + '%';
      }, index * 200);
    });
    
    // Animate metric boxes with stagger
    metricBoxes.forEach((box, index) => {
      setTimeout(() => {
        box.classList.add('slide-up');
      }, index * 150);
    });
  }

  // Function to reset animations
  function resetAnimations() {
    // Reset all counters
    counters.forEach(counter => counter.reset());
    
    // Reset progress bars
    progressBars.forEach(bar => {
      bar.style.width = '0%';
    });
    
    // Reset metric boxes
    metricBoxes.forEach(box => {
      box.classList.remove('slide-up');
      // Force reflow to restart animation
      void box.offsetWidth;
    });
  }

  // Intersection Observer for scroll-triggered animations
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Reset and trigger animations every time section comes into view
        resetAnimations();
        setTimeout(() => {
          triggerAnimations();
        }, 50);
      } else {
        // Optional: Reset when leaving view so it's ready for next time
        setTimeout(() => {
          resetAnimations();
        }, 300);
      }
    });
  }, observerOptions);

  // Observe the metrics section
  observer.observe(metricsSection);

  // Also trigger immediately if section is already in view on page load
  const rect = metricsSection.getBoundingClientRect();
  const isInView = rect.top < window.innerHeight && rect.bottom > 0;
  
  if (isInView) {
    setTimeout(() => {
      triggerAnimations();
    }, 300);
  }
});