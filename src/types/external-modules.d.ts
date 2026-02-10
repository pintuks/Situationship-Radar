declare module "marked" {
  export const marked: {
    parse(input: string, options?: { async?: boolean }): string | Promise<string>;
  };
}

declare module "jsdom" {
  export class JSDOM {
    constructor(html?: string);
    window: {
      document: {
        body: {
          textContent: string | null;
        };
      };
    };
  }
}

declare module "dompurify" {
  interface DOMPurifyInstance {
    sanitize(input: string, options?: { ALLOWED_TAGS?: string[]; ALLOWED_ATTR?: string[] }): string;
  }

  export default function createDOMPurify(window: unknown): DOMPurifyInstance;
}

declare module "canvas-confetti" {
  type ConfettiOptions = {
    particleCount?: number;
    spread?: number;
    startVelocity?: number;
    origin?: { x?: number; y?: number };
    scalar?: number;
  };

  type ConfettiGlobalOptions = {
    resize?: boolean;
    useWorker?: boolean;
  };

  type ConfettiInstance = (options?: ConfettiOptions) => Promise<null> | null;

  interface ConfettiFn {
    (options?: ConfettiOptions): Promise<null> | null;
    create(canvas?: HTMLCanvasElement | null, options?: ConfettiGlobalOptions): ConfettiInstance;
  }

  const confetti: ConfettiFn;
  export default confetti;
}
