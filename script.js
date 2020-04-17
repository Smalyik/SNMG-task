const getData = async () => {
	const response = await fetch('/data.json')
	const data = await response.json()
	return data
}

const getRandomBackground = () => {
	const randomNumber = Math.floor(Math.random() * Math.floor(100));
	const scale = window.innerWidth < 3840 ? '@0.5x' : ''
	if (randomNumber > 67) {
		return `/img/dot-stroke${scale}.png`
	} else if (67 > randomNumber && randomNumber > 34) {
		return `/img/wave-stroke${scale}.png`
	} else {
		return `/img/blue-stroke${scale}.png`
	}
} 

const socialBoxFactory = ({ name, text, socialWebType, photoUrl }) => {
	let boxTemplate
	let fontSize = 3.5
	let newText
	const words = text.split(' ')
	if (words.length > 15) {
		fontSize = 2
	}
	if (words.length > 22) {
		words.splice(22)
		newText = words.join(' ').concat('...')
	} else {
		newText = words.join(' ')
	}

	if (photoUrl) {
		boxTemplate = `
			<div class="social-box" style="background-image: url(${photoUrl});">
				<div class="social-box__text-box without-photo">
					<div class="social-box__text" style="font-size: ${fontSize}em">${newText}</div>
					<div class="social-box__name">
						<i class="fab fa-${socialWebType.toLowerCase()}"></i>
						${name}
					</div>
				</div>
			</div>
		`
	} else {
		boxTemplate = `
			<div class="social-box" style="background-image: url(${getRandomBackground()});">
				<div class="social-box__text-box">
					<div class="social-box__text" style="font-size: ${fontSize}em">${newText}</div>
					<div class="social-box__name">
						<i class="fab fa-${socialWebType.toLowerCase()}"></i>
						${name}
					</div>
				</div>
			</div>
		`
	}
	return boxTemplate
}

const showText = (box) => {
	box.addClass('active')
	setTimeout(() => {
		const text = box.find('.social-box__text')
		text.animate({
			opacity: 1
		}, 1000)
	}, 1500)
}

const hideText = (box) => {
	const text = box.find('.social-box__text')
	text.animate({
		opacity: 0
	}, 1000)
	setTimeout(() => {
		box.removeClass('active')
	}, 1500)
}

const startBoxAnimation = (box) => {
	setTimeout(() => {
		showText(box)
		setTimeout(() => {
			hideText(box)
		}, 12000);
		setInterval(() => {
			showText(box)
			setTimeout(() => {
				hideText(box)
			}, 12000);
		}, 24000);
	}, 1000);
}

let stopSlides = false;

const initSlider = () => {
	const sliderConfig = {
		infinite: true,
		slidesToShow: 4,
		slidesToScroll: 1,
		arrows: false,
		swipe : false,
	}
	$('.first-line').slick(sliderConfig);
	$('.second-line').slick(sliderConfig);
	let slidesCounter = 0;
	setInterval(() => {
		if (slidesCounter === 8) {
			slidesCounter = 0;
			showPromoLine()
			setTimeout(() => {
				hidePromoLine()
			}, 8000);
		} else if (!stopSlides) {
			$('.first-line').slick('slickNext')
			$('.first-line').slick('slickPrev')
			slidesCounter += 1
		}
	}, 8000);
	setTimeout(() => {
		setInterval(() => {
			if (!stopSlides) {
				$('.second-line').slick('slickNext')
			}
		}, 8000);
	}, 8000);
}

const promoLine = $('.promo-line')
const firstLine = $('.first-line')
const secondLine = $('.second-line')

const showPromoLine = () => {
	stopSlides = true
	const height = promoLine.height()
	firstLine.css('transform', `translateY(${-height/2}px)`)
	secondLine.css('transform', `translateY(${height/2 + 60}px)`)
	promoLine.addClass('active')
}

const hidePromoLine = () => {
	firstLine.css('transform', `translateY(0px)`)
	secondLine.css('transform', `translateY(0px)`)
	promoLine.removeClass('active')
	stopSlides = false;
}

const startLines = async () => {
	firstLine.hide()
	secondLine.hide()
	const { data } = await getData()
	data.map((boxInfo, index) => {
		const boxTemplate = socialBoxFactory(boxInfo)
		if ((index+1) % 2 !== 0) {
			firstLine.prepend(boxTemplate)
			const thisBox = firstLine.children().eq(0)
			setTimeout(() => {
				startBoxAnimation(thisBox)
			}, Math.floor(Math.random() * Math.floor(5000)));
		} else {
			secondLine.prepend(boxTemplate)
			const thisBox = secondLine.children().eq(0)
			setTimeout(() => {
				startBoxAnimation(thisBox)
			}, Math.floor(Math.random() * Math.floor(5000)));
		}
	})
}


$(document).ready(function(){
	startLines()
	setTimeout(() => {
		firstLine.show()
		secondLine.show()
		initSlider()
	}, 200);
});

