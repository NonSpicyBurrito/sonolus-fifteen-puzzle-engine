import { options } from '../../configuration/options.js'
import { effect } from '../effect.js'
import { skin } from '../skin.js'
import { Status, state } from '../state.js'

const completed = [
    skin.sprites.n1.id,
    skin.sprites.n2.id,
    skin.sprites.n3.id,
    skin.sprites.n4.id,
    skin.sprites.n5.id,
    skin.sprites.n6.id,
    skin.sprites.n7.id,
    skin.sprites.n8.id,
    skin.sprites.n9.id,
    skin.sprites.n10.id,
    skin.sprites.n11.id,
    skin.sprites.n12.id,
    skin.sprites.n13.id,
    skin.sprites.n14.id,
    skin.sprites.n15.id,
    -1,
] as const

export class Game extends Archetype {
    board = this.entityMemory(Tuple(16, DataType<SkinSpriteId | -1>))

    empty = this.entityMemory({
        i: Number,
        x: Number,
        y: Number,
    })

    animation = this.entityMemory({
        i: Number,
        x: Number,
        y: Number,
        t: Number,
    })

    preprocess() {
        if (multiplayer.isMultiplayer) this.randomizeBoard()

        skin.transform.set(Mat.identity.scale(0.375, -0.375).translate(-0.75, 0.75))

        score.base.perfect = 1

        ui.menu.set({
            anchor: screen.rect.lt.add(new Vec(0.05, -0.05)),
            pivot: { x: 0, y: 1 },
            size: new Vec(0.15, 0.15).mul(ui.configuration.menu.scale),
            rotation: 0,
            alpha: ui.configuration.menu.alpha,
            horizontalAlign: HorizontalAlign.Center,
            background: true,
        })
    }

    initialize() {
        if (!multiplayer.isMultiplayer) this.randomizeBoard()

        this.empty.i = 15
        this.empty.x = 3
        this.empty.y = 3

        this.animation.t = -1000
    }

    touch() {
        if (state.status !== Status.Ongoing) return

        if (time.now < this.animation.t) return

        for (const touch of touches) {
            if (!touch.started) continue

            const x = Math.floor(touch.x / 0.375) + 2
            const y = Math.floor(touch.y / -0.375) + 2
            if (x < 0 || x > 3 || y < 0 || y > 3) continue

            if (Math.abs(x - this.empty.x) + Math.abs(y - this.empty.y) !== 1) continue

            const i = x + y * 4

            this.animation.i = this.empty.i
            this.animation.x = this.empty.x
            this.animation.y = this.empty.y
            this.animation.t = time.now + 0.1

            this.board.set(this.empty.i, this.board.get(i))
            this.board.set(i, -1)

            this.empty.i = i
            this.empty.x = x
            this.empty.y = y

            effect.clips.tap.play(0)

            if (this.isDone) state.status = Status.Won
            return
        }
    }

    updateSequential() {
        if (state.status !== Status.Ongoing) return

        skin.sprites.bar.draw(
            new Rect({
                l: screen.l,
                r: Math.remap(0, options.timeLimit, screen.r, screen.l, time.now),
                b: screen.t - 0.025,
                t: screen.t,
            })
                .translate(0.75, -0.75)
                .scale(1 / 0.375, -1 / 0.375),
            1000,
            1,
        )

        if (time.now < options.timeLimit) return

        state.status = Status.Loss
    }

    updateParallel() {
        for (let i = 0; i < this.board.length; i++) {
            if (time.now < this.animation.t && i === this.animation.i) continue

            const id = this.board.get(i)
            if (id === -1) continue

            const x = i % 4
            const y = Math.floor(i / 4)
            const layout = this.square(x, y)

            skin.sprites.draw(id, layout, 2, 1)
            skin.sprites.cell.draw(layout, 1, 1)
        }

        if (time.now < this.animation.t) {
            const s = Math.unlerp(this.animation.t - 0.1, this.animation.t, time.now)
            const layout = this.square(
                Math.lerp(this.empty.x, this.animation.x, s),
                Math.lerp(this.empty.y, this.animation.y, s),
            )

            skin.sprites.draw(this.board.get(this.animation.i) as never, layout, 2, 1)
            skin.sprites.cell.draw(layout, 1, 1)
        }

        skin.sprites.board.draw(this.square(0, 0, 4), 0, 1)
    }

    get isDone() {
        for (const [i, id] of completed.entries()) {
            if (this.board.get(i) !== id) return false
        }

        return true
    }

    randomizeBoard() {
        for (const [i, id] of completed.entries()) {
            this.board.set(i, id)
        }

        let parity = 0
        for (let i = 14; i > 0; i--) {
            const j = Math.randomInt(0, i + 1)

            if (i !== j) {
                this.swap(i, j)
            } else {
                parity++
            }
        }
        if (parity % 2) this.swap(0, 1)
    }

    swap(i: number, j: number) {
        const temp = this.board.get(i)
        this.board.set(i, this.board.get(j))
        this.board.set(j, temp)
    }

    square(x: number, y: number, s = 1) {
        return new Rect({
            l: x,
            r: x + s,
            t: y,
            b: y + s,
        })
    }
}
