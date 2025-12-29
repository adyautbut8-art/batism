"use client"
import { useEffect, useRef } from 'react'

type Props = {
	adSlot: string
	style?: React.CSSProperties
	className?: string
}

export default function AdSenseAd({ adSlot, style, className }: Props) { 
	const insRef = useRef<HTMLTextAreaElement | HTMLDivElement | HTMLElement | null>(null)
	useEffect(() => {
		const el = insRef.current as HTMLElement | null
		if (!el) return

		let ro: ResizeObserver | null = null
		let intervalId: number | null = null

		const tryPush = () => {
			try {
				const width = el.offsetWidth || 0
				if (width > 0) {
					;(window as any).adsbygoogle = (window as any).adsbygoogle || []
					;(window as any).adsbygoogle.push({})

					// success — stop observers/interval

					if (ro) {
						try { ro.disconnect() } catch (e) {}
						ro = null
					}
					if (intervalId) {
						clearInterval(intervalId)
						intervalId = null
					}
				}
			} catch (e) {
				// ignore push errors
			}
		}

		// Use ResizeObserver when available to detect when element gets size
		if (typeof ResizeObserver !== 'undefined') {
			try {
				ro = new ResizeObserver(() => tryPush())
				ro.observe(el)
			} catch (e) {
				ro = null
			}
		}

		// initial attempt and fallback interval
		tryPush()
		let tries = 0
		intervalId = window.setInterval(() => {
			tries += 1
			tryPush()
			if (tries > 12) {
				if (intervalId) { clearInterval(intervalId); intervalId = null } 
				if (ro) { try { ro.disconnect() } catch (e) {} ; ro = null }     
			}
		}, 500)

		return () => {
			if (ro) try { ro.disconnect() } catch (e) {}
			if (intervalId) clearInterval(intervalId)
		}
	}, [])

	return (
		<>
			<ins
				className={`adsbygoogle ${className ?? ''}`}
				style={style ?? { display: 'block' }}
				data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-3279723494502237'}
				data-ad-slot={adSlot}
				data-ad-format="auto"
				data-full-width-responsive="true"
			/>
			{/* debug marker removed for production */}
		</>
	)
}
