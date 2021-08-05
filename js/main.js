
function start() {

    $('.beginning').hide();
    $('.background-game').append('<div class="player anima1"></div>');
    $('.background-game').append('<div class="enemy1 anima2"></div>');
    $('.background-game').append('<div class="enemy2"></div>');
    $('.background-game').append('<div class="ally anima3"></div>');
    $('.background-game').append('<div class="energybar"></div>');
    $('.background-game').append('<div class="scoreboard"></div>');
    
    const GAME = {};
    const KEYS = {
        W: 87,
        S: 83,
        D: 68
    };
    let points = 0;
    let saved = 0;
    let dead = 0;
    let currentEnergy = 3;
    const PRESSED = [];
    const SPEED = {
        'enemy1': {
            startSpeed: 5,
            increment: .15
        },
        'enemy2': {
            startSpeed: 3,
            increment: .1
        },
        'ally': {
            startSpeed: 1,
            increment: .05
        }
    };
    let canShoot = true;
    let endGame = false;
    let positionY = parseInt(Math.random() * 334);
    let shotTime = null;
    let shotSound = document.getElementById('shotSound');
    let explosionSound = document.getElementById('explosionSound');
    let music = document.getElementById('music');
    let gameOverSound = document.getElementById('gameOverSound');
    let deadSound = document.getElementById('deadSound');
    let savedSound = document.getElementById('savedSound');

    music.addEventListener('ended', function() {music.currentTime = 0; music.play();}, false);
    music.play();

    $(document).keydown(function(e){
        PRESSED[e.which] = true;
    });

    $(document).keyup(function(e){
        PRESSED[e.which] = false;
    });

    GAME.timer = setInterval(loop, 30);

    function shoot() {
        if(canShoot === true) {
            canShoot = false;
            shotSound.play();

            let top = parseInt($('.player').css('top'));
            let positionX = parseInt($('.player').css('left'));
            let shotX = positionX + 190;
            let shotTop = top + 37;

            $('.background-game').append('<div class="shot"></div>'); 
            $('.shot').css('top', shotTop);
            $('.shot').css('left', shotX);

            shotTime = window.setInterval(firing, 30);
        };

        function firing() {
            let positionX = parseInt($('.shot').css('left'));
            $('.shot').css('left', positionX + 15);

            if(positionX > 900) {
                window.clearInterval(shotTime);
                shotTime = null;
                $('.shot').remove();
                canShoot = true;
            };
        };
    };

    function accelerate(i) {
        setInterval(function() {
            SPEED[i]['startSpeed'] += SPEED[i]['increment'];
        }, 8000);
    };

    function moveBackground() {
        let left = parseInt($('.background-game').css('background-position'));
        $('.background-game').css('background-position', left - 1);
    };

    function movePlayer() {
        if(PRESSED[KEYS.W]) {
            let top = parseInt($('.player').css('top'));
            $('.player').css('top', top - 10);

            if(top <= 10) {
                $('.player').css('top',top);
            };
        };

        if(PRESSED[KEYS.S]) {
            let top = parseInt($('.player').css('top'));
            $('.player').css('top', top + 10);
            
            if(top >= 434) {
                $('.player').css('top', top);
            };
        };

        if(PRESSED[KEYS.D]) {
            shoot();
        }
    };
    
    function moveEnemy1() {
        let positionX = parseInt($(".enemy1").css("left"));
        $(".enemy1").css("left", positionX - SPEED['enemy1']['startSpeed']);
        $(".enemy1").css("top", positionY);
            
        if (positionX <= 0) {
        positionY = parseInt(Math.random() * 334);
        $(".enemy1").css("left", 694);
        $(".enemy1").css("top", positionY);   
        }
    };

    function moveEnemy2() {
        let positionX = parseInt($(".enemy2").css("left"));
        $(".enemy2").css("left", positionX - SPEED['enemy2']['startSpeed']);
            
        if (positionX <= 0) {
            $(".enemy2").css("left", 775);
        }
    };

    function moveAlly() {
        let positionX = parseInt($(".ally").css("left"));
        $(".ally").css("left", positionX + SPEED['ally']['startSpeed']);
            
        if (positionX > 906) {
        $(".ally").css("left", 0); 
        }
    };
  
    function collision() {
        let collision1 = ($('.player').collision($('.enemy1')));
        let collision2 = ($('.player').collision($('.enemy2')));
        let collision3 = ($('.player').collision($('.ally')));
        let collision4 = ($('.shot').collision($('.enemy1')));
        let collision5 = ($('.shot').collision($('.enemy2')));
        let collision6 = ($('.enemy2').collision($('.ally')));

        if(collision1.length > 0) {
            currentEnergy--;
            let enemy1X = parseInt($('.enemy1').css('left'));
            let enemy1Y = parseInt($('.enemy1').css('top'));
            explosion1(enemy1X, enemy1Y);

            positionY = parseInt(Math.random() * 334);
            $('.enemy1').css('left', 694);
            $('.enemy1').css('top', positionY);
        };

        if(collision2.length > 0) {
            currentEnergy--;
            let enemy2X = parseInt($('.enemy2').css('left'));
            let enemy2Y = parseInt($('.enemy2').css('top'));
            explosion2(enemy2X, enemy2Y);

            $('.enemy2').remove();

            repositionEnemy();
            
        };

        if(collision3.length > 0) {
            saved++;
            savedSound.play();

            $('.ally').remove();
            
            repositionAlly();
        }

        if(collision4.length > 0) {
            points += 100;
            let enemy1X = parseInt($('.enemy1').css('left'));
            let enemy1Y = parseInt($('.enemy1').css('top'));
            
            explosion1(enemy1X, enemy1Y);
            $('.shot').css('left', 950);

            positionY = parseInt(Math.random() * 334);
            $('.enemy1').css('left', 694);
            $('.enemy1').css('top', positionY);
        };

        if(collision5.length > 0) {
            points += 50;
            let enemy2X = parseInt($('.enemy2').css('left'));
            let enemy2Y = parseInt($('.enemy2').css('top'));
            explosion2(enemy2X, enemy2Y);

            $('.enemy2').remove();
            $('.shot').css('left', 950);

            repositionEnemy();       
        };

        if(collision6.length > 0) {
            dead++;
            let allyX = parseInt($('.ally').css('left'));
            let allyY = parseInt($('.ally').css('top'));
            explosion3(allyX, allyY);
            
            $('.ally').remove();
            
            repositionAlly();
        };
    };

    function explosion1(enemy1X, enemy1Y) {
        $('.background-game').append('<div class="explosion1"></div>');
        $('.explosion1').css('background', 'url(img/explosao.png');
        $('.explosion1').css('top', enemy1Y);
        $('.explosion1').css('left', enemy1X);
        $('.explosion1').animate({width: 200, opacity: 0}, 'slow');
        explosionSound.play();

        let explosionTime = window.setInterval(removeExplosion, 1000);

        function removeExplosion() {
            $('.explosion1').remove();
            window.clearInterval(explosionTime);
            explosionTime = null;
        };
    };

    function explosion2(enemy2X, enemy2Y) {
        $('.background-game').append('<div class="explosion2"></div>');
        $('.explosion2').css('background', 'url(img/explosao.png');
        $('.explosion2').css('top', enemy2Y);
        $('.explosion2').css('left', enemy2X);
        $('.explosion2').animate({width: 200, opacity: 0}, 'slow');
        explosionSound.play();

        let explosionTime = window.setInterval(removeExplosion, 1000);

        function removeExplosion() {
            $('.explosion2').remove();
            window.clearInterval(explosionTime);
            explosionTime = null;
        };
    };

    function explosion3(allyX, allyY) {
        $('.background-game').append('<div class="explosion3 anima4"></div>');
        $('.explosion3').css('top', allyY);
        $('.explosion3').css('left', allyX);
        deadSound.play();

        let explosionTime = window.setInterval(removeExplosion, 1000);

        function removeExplosion() {
            $('.explosion3').remove();
            window.clearInterval(explosionTime);
            explosionTime = null;
        };
    };

    function repositionEnemy() {
        let collisionTime = window.setInterval(reposition, 5000);

        function reposition() {
            window.clearInterval(collisionTime);
            collisionTime = null;

            if(endGame === false) {
                $('.background-game').append('<div class="enemy2"></div>');
            };
        };
    }; 

    function repositionAlly() {
        let timeAlly = window.setInterval(repositionA, 6000);

        function repositionA() {
            window.clearInterval(timeAlly);
            timeAlly = null;

            if(endGame === false) {
                $('.background-game').append('<div class="ally anima3"></div>');
            };
        };
    };

    function score() {
        $('.scoreboard').html('<ul><li>Points: ' + points +'</li><li>Saved: ' + saved +'</li><li>Dead: ' + dead +'</li></ul>');
    };

    function energy() {
        if (currentEnergy === 3) {
            $('.energybar').css('background', 'url(img/energia3.png)');
        };

        if (currentEnergy === 2) {
            $('.energybar').css('background', 'url(img/energia2.png)');
        };

        if (currentEnergy === 1) {
            $('.energybar').css('background', 'url(img/energia1.png)');
        };

        if (currentEnergy === 0) {
            $('.energybar').css('background', 'url(img/energia0.png)');
            gameOver();
        };
    };

    function gameOver() {
        endGame = true;
        music.pause();
        gameOverSound.play();

        window.clearTimeout(GAME.timer);
        GAME.timer = null;

        $('.player').remove();
        $('.enemy1').remove();
        $('.enemy2').remove();
        $('.ally').remove();
        $('.scoreboard').remove();
        $('.energybar').remove();

        $('.background-game').append('<div class="end"></div>');
        $('.end').html('<h1>Game Over</h1><p class="endMessage">Your score was: ' + points + '</p>' + '<button class="button" onClick="restartGame()">Play Again</button>');
    };

    accelerate('enemy1');
    accelerate('enemy2');
    accelerate('ally');

    function loop() {
        moveBackground();
        movePlayer();
        moveEnemy1();
        moveEnemy2();
        moveAlly();
        collision();
        score();
        energy();
    };
};

function restartGame() {
    gameOverSound.pause();
    $('.end').remove();
    start();
};



