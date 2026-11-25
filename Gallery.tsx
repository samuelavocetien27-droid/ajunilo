'use client';
import { useState } from 'react';
import { Img as I } from '@/lib/types';
import Img from './Img';
export default function Gallery({ images, alt }: { images: I[]; alt: string }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-mist"><Img src={images[i]?.url} alt={alt} className="h-full w-full object-contain" /></div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((m, k) => (
            <button key={m.id} onClick={() => setI(k)} aria-label={`Photo ${k + 1}`}
              className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${k === i ? 'border-gold' : 'border-transparent'}`}>
              <Img src={m.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
