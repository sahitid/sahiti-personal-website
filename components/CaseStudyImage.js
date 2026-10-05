import { useState } from 'react';
import images from '../data/vroom-images.json';

// Only mapped Vroom assets are optimized; other case-study images retain their sources.
export default function CaseStudyImage({ src, alt, sizes = '(max-width: 712px) calc(100vw - 40px), 672px', style, onLoad, ...props }) {
  const asset = images[src];
  const [loaded, setLoaded] = useState(false);
  if (!asset) return <img src={src} alt={alt} style={style} decoding="async" {...props} onLoad={onLoad} />;
  const fallback = asset.variants.find(image => image.width >= 800) || asset.variants.at(-1);
  return <img
    {...props}
    src={fallback.src}
    srcSet={asset.variants.map(image => `${image.src} ${image.width}w`).join(', ')}
    sizes={sizes}
    width={asset.width}
    height={asset.height}
    alt={alt}
    decoding="async"
    style={{
      backgroundImage: loaded ? undefined : `url("${asset.placeholder}")`,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      ...style,
    }}
    onLoad={event => { setLoaded(true); onLoad?.(event); }}
  />;
}
