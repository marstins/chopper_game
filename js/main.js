
function start() {

    $('.beginning').hide();

    $('.background-game').append('<div class="player anima1"></div>');
    $('.background-game').append('<div class="enemy1 anima2"></div>');
    $('.background-game').append('<div class="enemy2"></div>');
    $('.background-game').append('<div class="ally anima3"></div>');

    const GAME = {};
    const KEYS = {
        W: 87,
        S: 83,
        D: 68
    };
    const PRESSED = [];
    var positionY = parseInt(Math.random() * 334);

    $(document).keydown(function(e){
        PRESSED[e.which] = true;
    });

    $(document).keyup(function(e){
        PRESSED[e.which] = false;
    });

    GAME.timer = setInterval(loop, 30);
    
    let speed = 5;
    setInterval(function() {
        speed += 0.15;
        console.log(speed);
    }, 8000);
    
    function moveBackground() {
        let left = parseInt($('.background-game').css('background-position'));
        $('.background-game').css('background-position', left-1);
    };

    function movePlayer() {
        if(PRESSED[KEYS.W]) {
            let top = parseInt($('.player').css('top'));
            $('.player').css('top', top-10);

            if(top <= 10) {
                $('.player').css('top',top);
            };
        };

        if(PRESSED[KEYS.S]) {
            let top = parseInt($('.player').css('top'));
            $('.player').css('top', top+10);
            
            if(top >= 434) {
                $('.player').css('top', top);
            };
        };
    };
    
    function spawnEnemy1() {
        let positionX = parseInt($(".enemy1").css("left"));
        $(".enemy1").css("left", positionX - speed);
        $(".enemy1").css("top", positionY);
            
        if (positionX<=0) {
        positionY = parseInt(Math.random() * 334);
        $(".enemy1").css("left",694);
        $(".enemy1").css("top",positionY);   
        }
    };

    
    function loop() {
        moveBackground();
        movePlayer();
        spawnEnemy1();
    };
};



