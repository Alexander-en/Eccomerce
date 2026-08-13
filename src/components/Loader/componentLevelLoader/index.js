// "use client";

// import { PulseLoader } from "react-spinners";

// export default function ComponentLevelLoader({ text, color, loading, size }) {
//   if (loading) {
//     return (
//       <span className="inline-flex items-center justify-center gap-2">
//         <PulseLoader
//           color={color}
//           loading={loading}
//           size={size || 10}
//           data-testid="loader"
//         />
//         {text ? <span className="text-center">{text}</span> : null}
//       </span>
//     );
//   }

//   return (
//     <span className="flex gap-1 items-center">
//       {text}
//       <PulseLoader
//         color={color}
//         loading={loading}
//         size={size || 10}
//         data-testid="loader"
//       />
//     </span>
//   );
// }


"use client";

import { PulseLoader } from "react-spinners";

export default function ComponentLevelLoader({
  text,
  color = "#fff",
  loading,
  size = 6,
}) {
  return (
    <span className="inline-flex items-center justify-center gap-2">
      {text && <span>{text}</span>}

      {loading && (
        <PulseLoader
          color={color}
          size={size}
          data-testid="loader"
        />
      )}
    </span>
  );
} 