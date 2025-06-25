document.addEventListener("DOMContentLoaded", function (event) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        //  Setup variables
        const wheel = document.querySelector(".wheel"),
            pointer = document.querySelector(".pointer"),
            btnPlay = document.querySelector(".play-button"),
            indicator = new TimelineMax(),
            spinWheel = new TimelineMax();

        let lastRotation = 0,
            currentRotation,
            tolerance;

        //  Creating the Timeline
        indicator.to(pointer, .13, {
                rotation: -10,
                transformOrigin: "50% 35%",
                ease: Power1.easeOut
            })
            .to(pointer, .13, {
                rotation: 3,
                ease: Power4.easeOut
            })

        //  Luckywheel animation
        spinWheel.to(wheel, 5, {
            rotation: 1060,
            transformOrigin: "50% 50%",
            ease: Back.easeInOut.config(0.4),
            onUpdate: (
                function () {
                    //_gsTransform: current position of the wheel
                    currentRotation = Math.round(this.target._gsTransform.rotation);
                    tolerance = currentRotation - lastRotation;

                    // console.log("lastRot: " + lastRotation);
                    // console.log("currentRot: " + currentRotation);
                    // console.log("tolerance: " + tolerance);
                    // console.log('indicator.progress', indicator.progress());
                    // console.log("spinwheelprogress: " + spinWheel.progress());

                    if (Math.round(currentRotation) % (360 / 8) <= tolerance &&
                        currentRotation > 0) {
                        if (indicator.progress() > .2 || indicator.progress() === 0) {
                            indicator.play(0);
                        }
                    }
                    lastRotation = currentRotation;
                }
            )
        });

        //   Button
        btnPlay.addEventListener('click', () => {
            // spinWheel.timeScale(1).seek(0);

        })
    }
});