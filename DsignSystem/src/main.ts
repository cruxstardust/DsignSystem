import './style.css'

type ButtonSize = 'small' | 'medium' | 'large'
type ButtonColor = 'primary' | 'secondary'

class DsButton extends HTMLElement {
  private buttonEl: HTMLButtonElement | null = null

  static get observedAttributes(): string[] {
    return ['size', 'color', 'outlined', 'disabled']
  }

  connectedCallback(): void {
    this.render()
  }

  attributeChangedCallback(): void {
    this.updateButton()
  }

  private render(): void {
    if (this.buttonEl) {
      this.updateButton()
      return
    }

    const button = document.createElement('button')
    button.type = 'button'

    const content = document.createElement('span')
    const children = Array.from(this.childNodes)
    children.forEach((node) => content.appendChild(node))
    button.appendChild(content)

    this.replaceChildren(button)
    this.style.display = 'block'
    this.style.width = '100%'

    this.buttonEl = button
    this.updateButton()
  }

  private updateButton(): void {
    if (!this.buttonEl) {
      return
    }

    const size = this.parseSize(this.getAttribute('size'))
    const color = this.parseColor(this.getAttribute('color'))
    const outlined = this.hasAttribute('outlined')
    const disabled = this.hasAttribute('disabled')

    this.buttonEl.className = this.buttonClassName(size, color, outlined)
    this.buttonEl.disabled = disabled
  }

  private parseSize(raw: string | null): ButtonSize {
    if (raw === 'small' || raw === 'medium' || raw === 'large') {
      return raw
    }
    return 'medium'
  }

  private parseColor(raw: string | null): ButtonColor {
    if (raw === 'primary' || raw === 'secondary') {
      return raw
    }
    return 'primary'
  }

  private buttonClassName(size: ButtonSize, color: ButtonColor, outlined: boolean): string {
    const base =
      'w-full rounded-[0.5rem] border font-semibold leading-tight transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none'

    const sizeClasses: Record<ButtonSize, string> = {
      small: 'px-5 py-3 text-sm',
      medium: 'px-6 py-4 text-base',
      large: 'px-7 py-[1.125rem] text-lg',
    }

    const colorClasses = outlined
      ? {
          primary: 'border-brand bg-transparent text-brand hover:bg-neutral-100',
          secondary: 'border-info-700 bg-transparent text-info-700 hover:bg-info-50',
        }
      : {
          primary: 'border-brand bg-brand text-neutral-0 hover:border-neutral-700 hover:bg-neutral-700',
          secondary:
            'border-info-700 bg-info-700 text-neutral-0 hover:border-info-400 hover:bg-info-400',
        }

    return `${base} ${sizeClasses[size]} ${colorClasses[color]}`
  }
}

customElements.define('ds-button', DsButton)

class DsChatInput extends HTMLElement {
  private rendered = false

  connectedCallback(): void {
    if (this.rendered) {
      return
    }

    const placeholder = this.getAttribute('placeholder') ?? 'Message Dsign AI...'
    const textareaId = `ds-chat-input-${Math.random().toString(36).slice(2, 10)}`

    this.className = 'block w-full'
    this.innerHTML = `
      <div class="w-full rounded-2xl border border-neutral-200 bg-neutral-0 p-3 shadow-[0_12px_24px_-20px_rgb(30_30_30_/_22%)] transition-shadow duration-150 focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-neutral-50 motion-reduce:transition-none">
        <label class="sr-only" for="${textareaId}">Message</label>
        <textarea
          id="${textareaId}"
          rows="3"
          placeholder="${placeholder}"
          class="w-full resize-none border-0 bg-transparent p-2 text-base text-neutral-900 placeholder:text-neutral-700/70 focus:outline-none focus-visible:outline-none focus-visible:shadow-none"
        ></textarea>

        <div class="mt-1 flex items-center justify-between gap-3">
          <div class="flex items-center gap-1">
            <button
              type="button"
              aria-label="Attach file"
              class="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-700 transition-colors duration-150 hover:bg-neutral-100 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.44 11.05 12.25 20.24a6 6 0 1 1-8.49-8.49l9.2-9.2a4 4 0 0 1 5.65 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>

            <button
              type="button"
              aria-label="Voice input"
              class="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-700 transition-colors duration-150 hover:bg-neutral-100 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 1 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 11a7 7 0 1 1-14 0"/>
                <path d="M12 18v4"/>
              </svg>
            </button>
          </div>

          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-[0.5rem] border border-brand bg-brand px-5 py-2.5 text-sm font-semibold text-neutral-0 transition-colors duration-150 hover:border-neutral-700 hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
          >
            Send
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 12 20 4l-5 8 5 8L3 12Z"/>
            </svg>
          </button>
        </div>
      </div>
    `

    this.rendered = true
  }
}

customElements.define('ds-chat-input', DsChatInput)
