document.addEventListener('DOMContentLoaded', () => {
	const body = document.querySelector('body'),
		topPannel = document.querySelector('.header-top'),
		botPannel = document.querySelector('.header-bot'),
		filter = document.querySelector('.filters'),
		closeFilterBtn = document.querySelector('.filters__close'),
		search = document.querySelector('.header-bot__search'),
		formWindow = document.querySelector('.form-wrapper'),
		formRegistration = document.querySelector('.form-reg'),
		forms = document.querySelectorAll('.form')

	body.addEventListener('scroll', (e) => {
		if (body.scrollTop > 0) {
			topPannel.classList.add('hidden')
			botPannel.classList.add('translate')
		} else {
			topPannel.classList.remove('hidden')
			botPannel.classList.remove('translate')
		}
	})

	search.addEventListener('focus', () => {
		filter.classList.add('visible')
		botPannel.style.height =
			botPannel.clientHeight + filter.clientHeight + 'px'
	})

	closeFilterBtn.addEventListener('click', () => {
		filter.classList.remove('visible')
		botPannel.style.height = ''
	})

	document.querySelector('#sign').addEventListener('click', () => {
		formWindow.classList.add('visible')
	})

	document.querySelector('#to-reg').addEventListener('click', () => {
		formRegistration.classList.add('active')
	})

	formWindow.addEventListener('click', (e) => {
		if (e.target === formWindow) {
			formWindow.classList.remove('visible')
			formRegistration.classList.remove('active')
		}
	})

	forms.forEach((form) => {
		form.addEventListener('submit', (e) => {
			e.preventDefault()
		})
	})
})
