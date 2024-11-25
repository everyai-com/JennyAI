export interface VoiceGrant {
  outgoing?: {
    application_sid: string;
  };
  incoming?: {
    allow: boolean;
  };
}

export interface VideoGrant {
  room?: string;
}

export interface AccessTokenOptions {
  ttl?: number;
  identity?: string;
  grants?: {
    voice?: VoiceGrant;
    video?: VideoGrant;
  };
}

export class AccessToken {
  constructor(
    private accountSid: string,
    private apiKey: string,
    private apiSecret: string,
    private options: AccessTokenOptions = {}
  ) {}

  addGrant(grant: VideoGrant | VoiceGrant) {
    if (!this.options.grants) {
      this.options.grants = {};
    }

    if ("room" in grant) {
      this.options.grants.video = grant as VideoGrant;
    } else {
      this.options.grants.voice = grant as VoiceGrant;
    }
  }

  toJwt() {
    const now = Math.floor(Date.now() / 1000);

    const payload = {
      jti: `${this.apiKey}-${now}`,
      grants: this.options.grants || {},
      iss: this.apiKey,
      sub: this.accountSid,
      exp: now + (this.options.ttl || 3600),
      iat: now,
      identity: this.options.identity,
    };

    const encoder = new TextEncoder();
    const header = { typ: "JWT", alg: "HS256" };

    const base64Header = btoa(JSON.stringify(header));
    const base64Payload = btoa(JSON.stringify(payload));

    const input = `${base64Header}.${base64Payload}`;
    const key = encoder.encode(this.apiSecret);
    const data = encoder.encode(input);

    return crypto.subtle
      .importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
      .then((key) => crypto.subtle.sign("HMAC", key, data))
      .then((signature) => {
        const base64Signature = btoa(
          Array.from(new Uint8Array(signature))
            .map((byte) => String.fromCharCode(byte))
            .join("")
        );
        return `${base64Header}.${base64Payload}.${base64Signature}`;
      });
  }
}
