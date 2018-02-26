;(function() {
	const m = (typeof global !== 'undefined')
		? (global.m || require('mithril'))
		: window.m


	const a0 = n => `0${n}`

	const displayHours = (hours, tfh) =>
		tfh && hours < 10
			? a0(hours)
			: tfh
			? hours
			: hours > 12
				? hours - 12
				: hours < 10 && hours > 0
					? a0(hours)
					: hours === 0
						? 12
						: hours

	const displayMinutes = minutes => minutes < 10 ? a0(minutes) : minutes

	const meridian = (hours, tfh) => tfh ? '' : hours > 11 ? 'PM' : 'AM'

	const NumSpan = {
		view({attrs, children}){
			return m('span.num',
				{
					id: attrs.id,
					class: attrs.editing == attrs.id ? 'current' : '',
					onclick: attrs.editing ? attrs.onclick : null
				},
				children
			)
		}
	}

	function numbers(w, increment) {
		const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
		return w == 'h'
			? array
			: increment == 5
				? array.map(n => n * 5)
				: [0, 15, 30, 45]
	}

	function boxClass(time, thisValue, editing) {
		let currentValue = time[editing]
		if (typeof thisValue == 'string') {
			currentValue = time.h < 12 ? 'AM' : 'PM'
		}
		return thisValue === currentValue ? 'current' : ''
	}

	function editorClass(editing, increment){
		const classes = ['editor']
		if (editing == 'm' && increment == 15) classes.push('i15')
		if (editing == 'r') classes.push('meridian')
		return classes.join(' ')
	}

	const TimePicker = ({attrs}) => {
		let time
		let tfh
		let editing
		let increment
		let begun = false

		function toggleEditor(e) {
			if (!begun) {
				time = { h: 0, m: 0}
				begun = true
			}
			let id = e.target.id || undefined
			if (!(editing || id)) id = 'h'
			chooseEditor(id)
		}

		function chooseEditor(id) {
			editing = id
			if (!editing) attrs.onchange(time)
		}

		function numberClick(e) {
			e.stopPropagation()
			chooseEditor(e.target.id)
		}

		function boxClick(n, e) {
			e.stopPropagation()
			if (typeof n == 'string') {
				let delta = 0
				if (time.h > 11 && n == 'AM') delta = -1
				else if (time.h < 12 && n == 'PM') delta = 1
				time.h += delta * 12
			}
			else time[editing] = n
			chooseEditor(editing == 'h' ? 'm' : editing == 'm' && !tfh ? 'r' : undefined)
		}

		function box(n){
			return m('.box'
				, {
					class: boxClass(time, n, editing),
					onclick: boxClick.bind(null, n)
				}
				, editing == 'h' ? displayHours(n, tfh) : displayMinutes(n)
			)
		}



		return {
			oninit: ({attrs}) => {
				time = attrs.time || time
				tfh = attrs.tfh || tfh
				increment = (attrs.increment === 5 || attrs.increment === 15) ? attrs.increment : 5
				if (time) begun = true
			},
			view: (vnode) => m('.mithril-timepicker',
				{ class: editing ? 'editing' : '' },
				editing && m('.overlay', { onclick: toggleEditor }),
				m('.display',
					{
						class: tfh ? 'tfh' : '',
						onclick: toggleEditor
					},
					begun
						? [
							m(NumSpan, { id: 'h', editing: editing, onclick: numberClick }, displayHours(time.h, tfh)),
							':',
							m(NumSpan, { id: 'm', editing: editing, onclick: numberClick }, displayMinutes(time.m, tfh)),
							!tfh && m('.num.meridian#r', { class: editing === 'r' ? 'current' : '' }, meridian(time.h, tfh))
						]
						: m('.clock')
				),
				editing && m('',
				{ class: editorClass(editing, increment) },
				editing == 'h'
					? [
						numbers(editing).map(n => box(n)),
						tfh && numbers(editing).map(n => box(n + 12))
					]
					: editing == 'm'
					? numbers(editing, increment).map(n => box(n))
					: [ box('AM'), box('PM') ]
				)
			)
		}
	}

	try { module.exports = TimePicker}
	catch(e) { window.TimePicker = TimePicker }
})()
