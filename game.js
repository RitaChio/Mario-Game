kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1]
})

const MOVE_SPEED = 120 
const JUMP_FORCE = 360
const BIG_JUMP_FORCE = 550
let CURRENT_JUMP_FORCE = JUMP_FORCE
let isJumping = true
const FALL_DEATH = 400


loadRoot('https://i.imgur.com/')
loadSprite('coin', 'Dsbe3ke.png')
loadSprite('flower', 'EZ7frCw.png')
loadSprite('evil-shroom', 'zovZ1hO.png')
loadSprite('grass', 'xxDJ1uG.png')
loadSprite('ground', 'gdUo43M.png')
loadSprite('stone', 'xh0Wi0K.png')
loadSprite('glass', '2T28p0x.png')
loadSprite('water', 'BMtYZfE.png')
loadSprite('brick', 'Qd1fVCg.png')
loadSprite('mario', 'QLww7aO.png')
loadSprite('peach', 'i92Z09H.png')
loadSprite('mushroom', 'D5eOg3y.png')
loadSprite('surprise', 'tdMS3jN.png')
loadSprite('unboxed', 'CCYpDVT.png')
loadSprite('pipe-top-left', 'uDJUktx.png')
loadSprite('pipe-top-right', 'jP6BDSm.png')
loadSprite('pipe-bottom-left', 'h9bu6HT.png')
loadSprite('pipe-bottom-right', 'enHKyOA.png')

loadSprite('blue-stone', 'mKhwFpM.png')
loadSprite('blue-brick', 'NqaqamH.png')
loadSprite('blue-steel', '5qVJBdW.png')
loadSprite('blue-evil-shroom', 'YjTD3Kp.png')
loadSprite('blue-surprise', 'z03JWoy.png')

scene('game', ({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const maps = [
        [   '                                     ',
            '                                     ',
            '                                     ',
            '                                     ',
            '                                     ',
            '  %     =*=%=                        ',
            '                                     ',
            '                     -+              ',
            '    f        ^     ^ ()              ',
            'ggggggggggggggggggggggg      gggggggg',
        ],
        [   '&                                    &',
            '&                        f     f     &',
            '&                       gg&&@@gg     &',
            '&&&&                                 &',
            '&                                    &',
            '&     @~@ @@@                        &',
            '&                          x         &',
            '&                         xxx     -+ &',
            '&             z     z   xxxxxxx   () &',
            '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
        ],
        [   '                                     x',  
            '       %%:::%*           %%%%%%%     x',
            '                                     x',
            '::::::                           ^   x',
            '                               :::   x',
            '       :%%%%%::                      x',
            '                        x            x',
            '                x   x   x   x    -+  x',
            '            ^ x x x x x x x x x  ()  x',
            '::::::::::::::::::::::::::::::::::::::',
        ],
        [   'x                                    x',
            'x                                    x',
            'x                                    x',
            'x                                    x',
            'x                                    x',
            'x           @x@@xx@               z  x',
            'x                             x@xx   x',
            'xxxxx xxx                            x',
            'x                                    x',
            'x            xxxxxxxxxx             zx',
            'x            [        [          xxxxx',
            'x            xxxxxxxxxx              x',
            'x     @x~xx               xxx@@@     x',
            'x                                 -+ x',
            'x             z                z  () x',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        ],
        [
            '                               %g%g*g                       ',
            '            %%%%%%*%%                                       ',
            '                                                            ',
            '                               gggggg                       ',
            '                      ^        //////                       ',
            ' %          gggggggggg                                    -+',
            '            //////////                                    ()',
            '            //////////      %%%       %g%g%            ggggg',
            'ggg                                                 f g/////',
            '///g                                             f  gg//////',
            '////g       f     ^      f         ^        f gggggg////////',
            '/////ggggggggggggggggggggggggggggggggggggggggg//////////////',
        ],
        [   '             %%%%%%%                       %%%     ',
            '                                                   ',
            '                                                 -+',
            '                                                ^()',
            '                 g%g            %*%%     ==========',
            '       [*[%[                             =[[===[[==',
            '       [   [                             ==========',
            '       [fff[          ^                ^ ==========',
            'ggggggggggggggggggggggggwwwwwwggggggggggggggggggggg',
            '////////////////////////wwwwww/////////////////////',
        ],
    ]   

    const levelCfg = {
        width: 20,
        height: 20,
        'm': [sprite('mario')],
        'p': [sprite('peach'), solid(), 'peach'],
        '=': [sprite('brick'), solid()],
        ':': [sprite('stone'), solid()],
        '[': [sprite('glass')],
        'w': [sprite('water'), solid()],
        'g': [sprite('grass'), solid()],
        '/': [sprite('ground'), solid()],
        '$': [sprite('coin'), 'coin'],
        'f': [sprite('flower')],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],
        '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
        '}': [sprite('unboxed'), solid()],
        '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
        ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
        '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
        '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
        '^': [sprite('evil-shroom'), solid(), 'dangerous'],
        '#': [sprite('mushroom'), solid(), 'mushroom', body()],
        '!': [sprite('blue-stone'), solid(), scale(0.5)],
        '&': [sprite('blue-brick'), solid(), scale(0.5)],
        'z': [sprite('blue-evil-shroom'), solid(), scale(0.5), 'dangerous'],
        '@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
        '~': [sprite('blue-surprise'), solid(), scale(0.5), 'mushroom-surprise'],
        'x': [sprite('blue-steel'), solid(), scale(0.5)],
        //add symbol for text bubble of info
    }

    const gameLevel = addLevel(maps[level], levelCfg)

    const scoreLabel = add([
        text(score),
        pos(30, 6),
        layer('ui'),
        {
            value: score,
        }
    ])

    add([text('level ' + parseInt(level + 1)), pos(40,6)])

    const infoBlock = add([
        text("Hi, I'm Rita. I'm working hard to create something awesome.", 12, {
            width: 500,
        }), 
        pos(30, -100),
    ])
    //set up if statement with level as parameter for text updates
    infoBlock
        if ( level > 0) {
        infoBlock.text = "I started to nail down the use of algorithms while craftng these games.";
        }
        if ( level > 1) {
            infoBlock.text = "I have enjoyed coding for years now. I am looking to improve even further.";
        }
        if ( level > 2) {
            infoBlock.text = "I welcome any feedback, so feel free to reach out via email!";
        }
        if ( level > 3) {
            infoBlock.text = "My next mission is to craft different characters entirely, making my own version of Candy Land!";
            }

    function big() {
        let timer = 0
        let isBig = false
        return {
            update() {
                if (isBig) {
                    CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
                    timer -= dt()
                    if (timer <= 0) {
                        this.smallify()
                    }
                }
            },
            isBig() {
                return isBig
            },
            smallify() {
                this.scale = vec2(1)
                CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
                timer = 0 
                isBig = false
            },
            biggify(time) {
                this.scale = vec2(2)
                timer = time
                isBig = true
            }
        }
    }

    const player = add([
        sprite('peach'), solid(),
        pos(30,0),
        body(),
        big(),
        origin('bot'),
    ])

    action('mushroom', (m) => {
        m.move(20, 0)
    })

    player.on("headbump", (obj) => {
        if (obj.is('coin-surprise')) { //replace coin-surprise with bubble of text about skills
            gameLevel.spawn('$', obj.gridPos.sub(0,1))// replace $ with somehting for text bubble
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0,0))
        }
        if (obj.is('mushroom-surprise')) { //replace mushroom-surprise with bubble of text about me
            gameLevel.spawn('#', obj.gridPos.sub(0,1)) //replace #
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0,0))
        }
    })

    player.collides('mushroom', (m) => {
        destroy(m)
        player.biggify(6)
    })

    player.collides('coin', (c) => {
        destroy(c)
        scoreLabel.value++
        scoreLabel.text = scoreLabel.value
    })

    const ENEMY_SPEED = 20

    action('dangerous', (d) => {
        d.move(-ENEMY_SPEED, 0)//include falldeath const/val, or pos.y >= brick/stone reverse function
        //give d sprite weight (enable )
    })

    player.collides('dangerous', (d) => {
        if(isJumping){
            destroy(d)
        } else {
            go('lose', { score: scoreLabel.value})
        }
    })

    player.action(() => {
        camPos(player.pos)
        if(player.pos.y >= FALL_DEATH) {
            go('lose', {score: scoreLabel.value})
        }
    })

    player.collides('pipe', () => {
        keyPress('down', () => {
            go('game', {
                level: (level + 1) % maps.length,
                score: scoreLabel.value
            })
        })
    })

    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
    })

    keyDown('right', () => {
        player.move(MOVE_SPEED, 0)
    })

    player.action(() => {
        if(player.grounded()) {
            isJumping = false
        }
    })

    keyPress('space', () => {
        if (player.grounded()) {
            isJumping = true
            player.jump(CURRENT_JUMP_FORCE)}
    })
})

scene('lose', ({ score }) => {
    add([text (score, 32), origin('center'), pos(width()/2, height()/ 2)])
})

start('game', { level: 0, score: 0})
