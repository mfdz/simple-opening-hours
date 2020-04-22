const t = require("tap")

const { default: oh, map } = require("../dist/simple-opening-hours")

t.ok((new oh("24/7")).isOpen())
t.ok((new oh(" 24/7")).isOpen())
t.ok((new oh(" 24/7 ")).isOpen())
t.ok((new oh("24/7 ")).isOpen())
t.ok((new oh("24 / 7")).isOpen())
t.ok((new oh("24/7")).getTable())
t.ok((new oh("24/7")).alwaysOpen)

t.notOk((new oh("off")).isOpen())
t.notOk((new oh(" off")).isOpen())
t.notOk((new oh("off ")).isOpen())
t.notOk((new oh(" off ")).isOpen())
t.ok((new oh("off")).alwaysClosed)

t.ok((new oh("Mo-Sa 06:00-22:00")).isOpen(new Date('2016-10-01 18:00')))
t.notOk((new oh("Mo 06:00-22:00")).isOpen(new Date('2016-10-01 18:00')))
t.ok((new oh("Mo-Sa 09:00+")).isOpen(new Date('2016-10-01 18:00')))
t.notOk((new oh("Mo-Sa off")).isOpen(new Date('2016-10-01 18:00')))
t.notOk((new oh("Mo-Sa 06:00-22:00")).isOpen(new Date('2016-10-01 05:00')))
t.ok((new oh("Mo-Sa 06:00-22:00")).getTable())

t.test("Simple Time tables", t => {
    const table = (new oh("Mo-Sa 06:00-22:00")).getTable()
    t.same(table, {
        su: [],
        mo: ["06:00-22:00"],
        tu: ["06:00-22:00"],
        we: ["06:00-22:00"],
        th: ["06:00-22:00"],
        fr: ["06:00-22:00"],
        sa: ["06:00-22:00"],
        ph: [],

    })
    t.end()
})

t.test("Complex Time tables", t => {
    const table = (new oh("Mo-Sa 06:00-14:00,15:00-22:00")).getTable()
    t.same(table, {
        su: [],
        mo: ["06:00-14:00", "15:00-22:00"],
        tu: ["06:00-14:00", "15:00-22:00"],
        we: ["06:00-14:00", "15:00-22:00"],
        th: ["06:00-14:00", "15:00-22:00"],
        fr: ["06:00-14:00", "15:00-22:00"],
        sa: ["06:00-14:00", "15:00-22:00"],
        ph: [],

    })
    t.end()
})

t.test("Time tables", t => {
    const openingHours = new oh("Mo-Sa 06:00-14:00")
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const result = map(openingHours, (weekday, times) => {
        if (times && times.length) {
            return weekdays[weekday] + " " + times.map(time => time).join("\t")
        } else {
            return weekdays[weekday] + " Closed"
        }
    }).join("\n")
    t.equal(result, "Mon 06:00-14:00\nTue 06:00-14:00\nWed 06:00-14:00\nThu 06:00-14:00\nFri 06:00-14:00\nSat 06:00-14:00\nSun Closed")
    t.end()
})

t.test("Semicolons", t => {
    const table = (new oh("Mo-Fr 07:00-22:00; Sa 07:00-22:00; PH off")).getTable()
    t.same(table, {
        su: [],
        mo: ["07:00-22:00"],
        tu: ["07:00-22:00"],
        we: ["07:00-22:00"],
        th: ["07:00-22:00"],
        fr: ["07:00-22:00"],
        sa: ["07:00-22:00"],
        ph: [],

    })
    t.end()
});

t.test("24/7", t => {
    const table = (new oh("24/7")).getTable()
    t.same(table, {
        mo: ["00:00-24:00"],
        tu: ["00:00-24:00"],
        we: ["00:00-24:00"],
        th: ["00:00-24:00"],
        fr: ["00:00-24:00"],
        sa: ["00:00-24:00"],
        su: ["00:00-24:00"],
        ph: ["00:00-24:00"]
    })
    t.end()
});

