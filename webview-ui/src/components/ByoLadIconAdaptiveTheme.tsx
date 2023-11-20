/**
 * A byoLAD icon that uses the `currentColor` CSS variable to adapt to the
 * current theme. A normal SVG was converted to this React format and all
 * `fill` attributes were changed to `fill="currentColor"`. This matches
 * the text color, just like the VS Code Codicons used elsewhere.
 * Based on "media/byolad_bw_zoom_24x24.svg" at commit 82a2577.
 */
export const ByoLadIconAdaptiveTheme = () => {
  const fill = "currentColor";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      version="1.1"
    >
      <g id="surface1">
        <path
          stroke="none"
          fillRule="nonzero"
          fill={fill}
          fillOpacity={1}
          d="M 16.96875 0.148438 C 16.777344 0.210938 16.570312 0.355469 16.511719 0.460938 C 16.445312 0.585938 16.53125 0.769531 16.894531 1.289062 C 17.25 1.789062 17.441406 2.175781 17.40625 2.289062 C 17.363281 2.414062 17.167969 2.484375 16.875 2.484375 C 16.585938 2.484375 16.539062 2.453125 16.089844 1.835938 C 15.5625 1.121094 15.375 1.054688 14.960938 1.421875 C 14.765625 1.597656 14.679688 1.820312 14.679688 2.160156 C 14.679688 2.566406 14.796875 2.851562 15.253906 3.496094 C 15.585938 3.96875 15.652344 4.039062 15.886719 4.148438 C 16.050781 4.226562 16.335938 4.304688 16.628906 4.347656 C 17.609375 4.5 17.792969 4.671875 17.585938 5.273438 C 17.492188 5.550781 17.460938 5.769531 17.429688 6.386719 C 17.378906 7.289062 17.328125 7.464844 16.703125 8.855469 C 16.484375 9.332031 16.234375 9.902344 16.140625 10.121094 C 15.886719 10.730469 15.839844 10.816406 15.792969 10.785156 C 15.710938 10.742188 15.652344 10.433594 15.625 9.867188 C 15.574219 8.941406 15.503906 8.335938 15.355469 7.605469 L 15.214844 6.90625 L 15.523438 6.339844 C 16 5.472656 16.089844 4.972656 15.847656 4.523438 C 15.707031 4.253906 15.234375 3.863281 14.792969 3.644531 C 13.945312 3.21875 12.398438 2.730469 11.144531 2.496094 C 10.546875 2.386719 10.386719 2.375 9.359375 2.375 C 8.371094 2.375 8.167969 2.386719 7.726562 2.476562 C 6.394531 2.746094 4.621094 3.425781 3.8125 3.984375 C 2.621094 4.792969 2.375 5.960938 2.910156 8.324219 C 3.078125 9.082031 3.078125 9.199219 2.898438 9.417969 C 2.542969 9.839844 2.398438 10.359375 2.492188 10.875 C 2.699219 12.011719 3.519531 12.898438 4.460938 12.996094 C 5 13.050781 5.039062 13.074219 5.476562 13.578125 C 5.894531 14.0625 6.046875 14.261719 6.046875 14.316406 C 6.046875 14.328125 5.828125 14.453125 5.558594 14.585938 C 4.65625 15.027344 3.894531 15.53125 2.960938 16.300781 C 2.726562 16.496094 2.476562 16.664062 2.410156 16.679688 C 2.015625 16.757812 1.578125 17.070312 1.265625 17.503906 C 1.105469 17.734375 1.078125 17.804688 1.050781 18.105469 C 1.027344 18.382812 0.992188 18.488281 0.863281 18.683594 C 0.226562 19.652344 0.125 20.199219 0.46875 20.898438 C 0.726562 21.421875 1.433594 22.152344 2.324219 22.8125 C 2.578125 23 2.585938 23.003906 2.929688 22.992188 L 3.269531 22.976562 L 2.871094 22.671875 C 1.824219 21.871094 1.257812 21.3125 0.96875 20.78125 C 0.777344 20.433594 0.738281 20.132812 0.839844 19.792969 C 0.984375 19.320312 1.402344 18.722656 1.589844 18.722656 C 1.71875 18.722656 1.976562 18.957031 2.304688 19.375 C 2.699219 19.871094 2.691406 19.894531 2.175781 19.964844 C 1.109375 20.101562 1.148438 20.273438 2.25 20.332031 C 3.171875 20.386719 3.542969 20.515625 3.96875 20.9375 C 4.261719 21.230469 4.46875 21.582031 4.777344 22.332031 L 5.054688 23 L 16.609375 23 L 16.585938 22.894531 C 16.574219 22.839844 16.507812 22.550781 16.433594 22.246094 C 16.308594 21.683594 16.046875 20.90625 15.882812 20.597656 C 15.71875 20.289062 15.519531 20.109375 15.246094 20.039062 C 14.957031 19.953125 14.710938 19.753906 14.511719 19.425781 C 14.410156 19.253906 14.378906 19.148438 14.375 18.9375 C 14.375 18.699219 14.390625 18.65625 14.515625 18.554688 C 14.761719 18.355469 14.894531 18.457031 14.996094 18.90625 C 15.046875 19.144531 15.140625 19.203125 15.488281 19.226562 L 15.816406 19.25 L 15.945312 19.480469 C 16.203125 19.945312 16.488281 21.117188 16.636719 22.320312 L 16.71875 23 L 17.246094 23 L 17.210938 22.664062 C 17.113281 21.65625 16.851562 20.363281 16.558594 19.375 C 16.453125 19.03125 16.367188 18.699219 16.367188 18.640625 C 16.367188 18.492188 16.433594 18.382812 17.007812 17.566406 C 17.722656 16.542969 18.523438 15.109375 18.527344 14.851562 C 18.527344 14.765625 18.625 14.71875 18.800781 14.71875 C 19.136719 14.71875 19.484375 14.261719 19.585938 13.683594 C 19.679688 13.15625 19.570312 12.824219 19.199219 12.5 L 18.917969 12.246094 L 19.320312 10.738281 C 19.964844 8.292969 20.082031 7.910156 20.195312 7.910156 C 20.398438 7.910156 20.832031 8.578125 20.832031 8.894531 C 20.832031 9.300781 21.207031 9.808594 21.644531 10 C 21.820312 10.078125 21.957031 10.097656 22.320312 10.097656 C 22.742188 10.097656 22.796875 10.085938 23.039062 9.953125 C 23.371094 9.773438 23.59375 9.488281 23.691406 9.113281 C 23.785156 8.761719 23.753906 8.539062 23.5625 8.15625 C 23.410156 7.851562 23.222656 7.675781 22.824219 7.484375 C 22.496094 7.328125 22.214844 7.085938 21.878906 6.679688 C 21.550781 6.285156 21.382812 5.988281 21.34375 5.726562 C 21.296875 5.4375 20.945312 4.800781 20.753906 4.660156 C 20.664062 4.585938 20.542969 4.457031 20.488281 4.371094 C 20.320312 4.097656 20.152344 3.957031 19.808594 3.785156 C 19.300781 3.527344 19.277344 3.476562 19.242188 2.574219 C 19.210938 1.765625 19.179688 1.640625 18.90625 1.144531 C 18.695312 0.773438 18.1875 0.316406 17.835938 0.1875 C 17.542969 0.0859375 17.203125 0.0703125 16.96875 0.148438 Z M 17.804688 0.667969 C 18.226562 0.871094 18.582031 1.355469 18.742188 1.953125 C 18.804688 2.171875 18.816406 2.351562 18.792969 2.78125 L 18.757812 3.335938 L 18.910156 3.609375 C 19.195312 4.109375 19.203125 4.140625 19.175781 4.226562 C 19.140625 4.332031 18.726562 4.511719 18.453125 4.542969 C 18.269531 4.5625 18.234375 4.550781 17.945312 4.300781 C 17.542969 3.957031 17.433594 3.90625 16.964844 3.863281 C 16.691406 3.839844 16.488281 3.796875 16.308594 3.710938 C 15.867188 3.503906 15.363281 2.953125 15.234375 2.539062 C 15.148438 2.273438 15.148438 2.152344 15.238281 1.949219 C 15.300781 1.808594 15.320312 1.792969 15.40625 1.839844 C 15.460938 1.867188 15.628906 2.050781 15.78125 2.253906 C 16.28125 2.902344 16.628906 3.074219 17.367188 3.023438 C 17.59375 3.003906 17.785156 2.980469 17.804688 2.96875 C 17.816406 2.949219 17.832031 2.660156 17.832031 2.324219 L 17.832031 1.710938 L 17.667969 1.484375 C 17.222656 0.886719 17.132812 0.714844 17.207031 0.601562 C 17.261719 0.515625 17.5625 0.546875 17.804688 0.667969 Z M 11.8125 3.21875 C 12.414062 3.28125 13.195312 3.449219 13.84375 3.667969 C 15.460938 4.203125 15.78125 4.773438 15.148438 5.972656 C 14.984375 6.277344 14.867188 6.394531 14.703125 6.394531 C 14.636719 6.394531 14.285156 6.300781 13.925781 6.191406 C 12.714844 5.8125 11.828125 5.6875 10.390625 5.6875 C 9.25 5.6875 8.609375 5.757812 7.828125 5.980469 C 7.566406 6.058594 7.316406 6.117188 7.273438 6.117188 C 7.097656 6.117188 7.179688 6.019531 8.136719 5.058594 C 8.605469 4.585938 8.972656 4.152344 9.128906 3.875 C 9.351562 3.480469 10.136719 3.207031 11.09375 3.179688 C 11.21875 3.179688 11.539062 3.195312 11.8125 3.21875 Z M 19.84375 4.332031 C 19.886719 4.394531 19.921875 4.53125 19.921875 4.65625 C 19.921875 4.917969 19.832031 4.945312 19.621094 4.75 C 19.46875 4.613281 19.449219 4.445312 19.570312 4.316406 C 19.671875 4.203125 19.757812 4.210938 19.84375 4.332031 Z M 19.273438 4.945312 C 19.363281 5.027344 19.390625 5.105469 19.390625 5.265625 C 19.390625 5.382812 19.378906 5.472656 19.363281 5.472656 C 19.347656 5.472656 19.292969 5.421875 19.238281 5.359375 C 19.179688 5.289062 19.09375 5.242188 19.023438 5.242188 C 18.902344 5.242188 18.898438 5.25 18.929688 5.460938 C 18.945312 5.585938 18.992188 5.90625 19.027344 6.1875 C 19.097656 6.710938 19.152344 6.808594 19.363281 6.808594 C 19.558594 6.808594 19.765625 6.976562 19.804688 7.164062 C 19.84375 7.351562 19.800781 7.515625 19.613281 7.941406 C 19.476562 8.246094 19.324219 8.761719 18.84375 10.507812 C 18.511719 11.710938 18.414062 11.945312 18.257812 11.921875 C 18.113281 11.898438 17.347656 11.601562 16.867188 11.386719 C 16.410156 11.171875 16.300781 11.058594 16.355469 10.851562 C 16.390625 10.699219 17.222656 8.839844 17.332031 8.65625 C 17.378906 8.574219 17.425781 8.472656 17.425781 8.433594 C 17.425781 8.394531 17.535156 8.109375 17.671875 7.804688 L 17.921875 7.246094 L 17.929688 6.484375 C 17.929688 5.796875 17.9375 5.707031 18.039062 5.5 C 18.269531 5.015625 18.511719 4.835938 18.925781 4.828125 C 19.109375 4.828125 19.179688 4.851562 19.273438 4.945312 Z M 20.472656 5.320312 C 20.46875 5.578125 20.308594 5.871094 20.089844 6.007812 C 19.921875 6.113281 19.804688 6.027344 19.851562 5.824219 C 19.902344 5.613281 20.144531 5.164062 20.242188 5.109375 C 20.410156 5.015625 20.472656 5.070312 20.472656 5.320312 Z M 20.902344 5.796875 C 20.960938 5.882812 20.578125 6.394531 20.453125 6.394531 C 20.332031 6.394531 20.476562 6.085938 20.703125 5.851562 C 20.808594 5.742188 20.859375 5.726562 20.902344 5.796875 Z M 21.625 7.105469 C 22.117188 7.667969 22.355469 7.867188 22.53125 7.867188 C 22.699219 7.867188 22.972656 8.078125 23.082031 8.292969 C 23.152344 8.425781 23.183594 8.582031 23.183594 8.757812 C 23.183594 9.328125 22.789062 9.691406 22.214844 9.652344 C 21.761719 9.617188 21.503906 9.371094 21.414062 8.875 C 21.335938 8.4375 20.921875 7.773438 20.292969 7.078125 C 20.140625 6.90625 20.015625 6.761719 20.015625 6.753906 C 20.015625 6.742188 20.152344 6.738281 20.320312 6.738281 C 20.554688 6.738281 20.648438 6.714844 20.761719 6.636719 C 21.007812 6.457031 21.089844 6.503906 21.625 7.105469 Z M 8.773438 7.261719 C 9.414062 7.449219 9.898438 7.511719 10.609375 7.511719 C 11.0625 7.511719 11.25 7.492188 11.386719 7.4375 C 11.597656 7.347656 12.496094 7.277344 13.777344 7.257812 L 14.664062 7.246094 L 14.746094 7.410156 C 14.960938 7.847656 15.089844 8.886719 15.089844 10.1875 C 15.097656 11.339844 15.066406 11.554688 14.832031 12.128906 C 14.363281 13.308594 13.363281 14.300781 12.234375 14.71875 C 11.0625 15.152344 9.625 15.175781 8.375 14.789062 C 7.476562 14.507812 6.511719 13.964844 5.945312 13.425781 C 5.558594 13.050781 5.398438 12.769531 5.441406 12.511719 C 5.457031 12.410156 5.488281 12.246094 5.5 12.144531 C 5.539062 11.898438 5.441406 11.898438 5.167969 12.140625 C 5.058594 12.234375 4.902344 12.351562 4.8125 12.390625 C 4.300781 12.640625 3.570312 12.214844 3.175781 11.421875 C 3.027344 11.121094 3 11.011719 2.984375 10.675781 C 2.964844 10.289062 2.972656 10.277344 3.125 10.054688 C 3.507812 9.515625 4.335938 9.359375 4.800781 9.738281 C 4.921875 9.835938 5.074219 10.152344 5.019531 10.199219 C 5.011719 10.207031 4.894531 10.148438 4.757812 10.070312 C 4.34375 9.820312 3.832031 9.824219 3.527344 10.082031 C 3.34375 10.230469 3.300781 10.421875 3.4375 10.472656 C 3.480469 10.488281 3.632812 10.445312 3.789062 10.378906 C 4.074219 10.246094 4.34375 10.230469 4.34375 10.34375 C 4.34375 10.382812 4.273438 10.433594 4.1875 10.453125 C 4.003906 10.496094 3.90625 10.671875 3.984375 10.816406 C 4.046875 10.914062 4.117188 10.925781 4.246094 10.835938 C 4.539062 10.648438 4.753906 10.738281 4.753906 11.050781 C 4.753906 11.25 4.703125 11.351562 4.496094 11.601562 C 4.230469 11.921875 4.488281 12.042969 4.800781 11.738281 C 5.011719 11.542969 5.136719 11.195312 5.136719 10.828125 C 5.136719 10.4375 5.175781 10.414062 5.332031 10.71875 C 5.488281 11.007812 5.699219 11.214844 6 11.363281 C 6.359375 11.535156 6.402344 11.4375 6.300781 10.636719 C 6.207031 9.839844 6.238281 8.101562 6.359375 7.726562 C 6.402344 7.589844 6.445312 7.46875 6.453125 7.460938 C 6.460938 7.457031 6.777344 7.433594 7.15625 7.40625 C 7.875 7.359375 8.136719 7.308594 8.179688 7.195312 C 8.210938 7.105469 8.238281 7.113281 8.773438 7.261719 Z M 16.246094 11.527344 C 17.238281 11.835938 18.734375 12.644531 18.992188 13.011719 C 19.136719 13.21875 19.132812 13.308594 18.949219 13.671875 L 18.792969 13.980469 L 18.191406 13.628906 C 17.441406 13.191406 16.652344 12.804688 16.007812 12.558594 C 15.414062 12.328125 15.265625 12.214844 15.265625 11.988281 C 15.265625 11.785156 15.441406 11.316406 15.519531 11.316406 C 15.550781 11.316406 15.878906 11.414062 16.246094 11.527344 Z M 16.425781 13.152344 C 17.707031 13.746094 18.046875 14.015625 18.046875 14.429688 C 18.046875 14.660156 17.1875 16.328125 16.707031 17.027344 C 16.386719 17.5 16.011719 17.941406 15.9375 17.941406 C 15.910156 17.941406 15.867188 17.863281 15.839844 17.765625 C 15.738281 17.464844 15.121094 16.371094 14.707031 15.769531 C 14.273438 15.144531 14.222656 15.042969 14.078125 14.578125 C 13.964844 14.21875 13.976562 14.175781 14.324219 13.761719 C 14.460938 13.59375 14.664062 13.320312 14.765625 13.15625 C 15.109375 12.609375 15.257812 12.609375 16.425781 13.152344 Z M 13.675781 14.707031 C 13.746094 14.851562 13.804688 15.574219 13.757812 15.75 C 13.71875 15.902344 13.558594 15.910156 13.363281 15.765625 C 13.046875 15.542969 12.527344 15.070312 12.566406 15.039062 C 12.652344 14.949219 13.425781 14.582031 13.515625 14.582031 C 13.578125 14.582031 13.636719 14.628906 13.675781 14.707031 Z M 7.019531 14.917969 C 7.453125 15.238281 7.953125 15.898438 8.257812 16.558594 C 8.699219 17.527344 8.765625 18.777344 8.40625 19.453125 C 8.269531 19.695312 7.921875 19.980469 7.496094 20.179688 C 7.167969 20.339844 7.117188 20.351562 6.679688 20.351562 C 6.203125 20.351562 6 20.296875 6 20.167969 C 6 20.128906 6.058594 20.074219 6.132812 20.046875 C 6.5625 19.871094 7.175781 19.238281 7.511719 18.625 C 7.707031 18.261719 7.734375 18.054688 7.574219 18.003906 C 7.492188 17.980469 7.441406 18.007812 7.335938 18.121094 C 7.261719 18.199219 7.199219 18.304688 7.199219 18.359375 C 7.199219 18.476562 6.464844 19.203125 6.054688 19.5 C 5.878906 19.625 5.601562 19.804688 5.433594 19.894531 C 5.136719 20.0625 5.125 20.0625 5.03125 19.976562 C 4.976562 19.933594 4.539062 19.449219 4.054688 18.90625 C 3.574219 18.363281 3.082031 17.816406 2.957031 17.691406 C 2.835938 17.5625 2.734375 17.429688 2.734375 17.386719 C 2.734375 17.269531 2.972656 16.988281 3.390625 16.601562 C 4.378906 15.695312 5.992188 14.765625 6.585938 14.765625 C 6.761719 14.765625 6.847656 14.792969 7.019531 14.917969 Z M 11.15625 15.453125 C 11.199219 15.519531 10.890625 16.285156 10.800781 16.328125 C 10.691406 16.386719 10.421875 16.210938 9.910156 15.753906 L 9.527344 15.414062 L 10.328125 15.410156 C 10.769531 15.410156 11.140625 15.429688 11.15625 15.453125 Z M 12.421875 15.542969 C 12.59375 15.625 13.171875 16.171875 13.464844 16.527344 C 13.601562 16.699219 13.613281 16.699219 13.761719 16.644531 C 13.90625 16.59375 13.929688 16.597656 14.070312 16.722656 C 14.222656 16.863281 14.6875 17.71875 14.6875 17.855469 C 14.6875 17.949219 14.398438 18.101562 13.894531 18.277344 C 13.320312 18.472656 12.941406 18.511719 11.523438 18.511719 L 10.203125 18.515625 L 10.148438 18.285156 C 10.117188 18.15625 10.042969 17.855469 9.984375 17.617188 C 9.925781 17.378906 9.792969 16.921875 9.6875 16.609375 C 9.566406 16.257812 9.511719 16.027344 9.542969 16 C 9.570312 15.972656 9.800781 16.152344 10.167969 16.480469 C 10.484375 16.773438 10.789062 17.019531 10.84375 17.035156 C 11.011719 17.074219 11.082031 16.964844 11.183594 16.515625 C 11.378906 15.628906 11.851562 15.261719 12.421875 15.542969 Z M 2.945312 18.214844 C 3.648438 19.03125 4.554688 20.148438 4.636719 20.300781 C 4.679688 20.375 4.699219 20.460938 4.683594 20.496094 C 4.609375 20.6875 3.964844 20.457031 3.519531 20.078125 C 3.277344 19.875 2.21875 18.667969 1.859375 18.1875 C 1.761719 18.058594 1.679688 17.917969 1.679688 17.875 C 1.679688 17.835938 1.78125 17.695312 1.90625 17.566406 L 2.125 17.335938 L 2.289062 17.488281 C 2.378906 17.570312 2.679688 17.898438 2.945312 18.214844 Z M 5.03125 21.0625 C 5.132812 21.125 5.082031 21.320312 4.96875 21.320312 C 4.871094 21.320312 4.820312 21.207031 4.867188 21.085938 C 4.894531 21.011719 4.9375 21.007812 5.03125 21.0625 Z M 5.03125 21.0625 "
        />
        <path
          stroke="none"
          fillRule="nonzero"
          fill="currentColor"
          fillOpacity={1}
          d="M 22.003906 8.4375 C 21.726562 8.703125 21.78125 9.070312 22.117188 9.226562 C 22.257812 9.289062 22.316406 9.292969 22.46875 9.25 C 22.695312 9.1875 22.800781 9.046875 22.800781 8.816406 C 22.800781 8.671875 22.765625 8.605469 22.613281 8.460938 C 22.371094 8.230469 22.222656 8.226562 22.003906 8.4375 Z M 22.003906 8.4375 "
        />
        <path
          stroke="none"
          fillRule="nonzero"
          fill={fill}
          fillOpacity={1}
          d="M 13.246094 7.953125 C 13.152344 8.132812 13.230469 8.195312 13.609375 8.261719 C 13.714844 8.277344 13.847656 8.332031 13.90625 8.386719 C 14.035156 8.496094 14.160156 8.460938 14.160156 8.3125 C 14.160156 8.179688 14.058594 8.082031 13.777344 7.960938 C 13.496094 7.84375 13.316406 7.839844 13.246094 7.953125 Z M 13.246094 7.953125 "
        />
        <path
          stroke="none"
          fillRule="nonzero"
          fill={fill}
          fillOpacity={1}
          d="M 8.785156 8.003906 C 8.585938 8.050781 8.398438 8.238281 8.398438 8.398438 C 8.398438 8.53125 8.46875 8.542969 8.625 8.417969 C 8.699219 8.367188 8.867188 8.292969 9.003906 8.253906 C 9.148438 8.214844 9.273438 8.160156 9.292969 8.132812 C 9.371094 8.019531 9.0625 7.941406 8.785156 8.003906 Z M 8.785156 8.003906 "
        />
        <path
          stroke="none"
          fillRule="nonzero"
          fill={fill}
          fillOpacity={1}
          d="M 9.191406 8.621094 C 9.113281 8.652344 9.007812 8.722656 8.960938 8.773438 C 8.878906 8.863281 8.878906 8.867188 9.027344 8.894531 C 9.25 8.9375 9.3125 9.003906 9.3125 9.195312 C 9.3125 9.507812 9.070312 9.574219 8.769531 9.332031 C 8.667969 9.253906 8.574219 9.203125 8.554688 9.222656 C 8.535156 9.242188 8.519531 9.367188 8.523438 9.5 C 8.53125 10.378906 9.898438 10.667969 10.277344 9.871094 C 10.449219 9.507812 10.355469 9.09375 10.027344 8.800781 C 9.757812 8.554688 9.480469 8.496094 9.191406 8.621094 Z M 9.191406 8.621094 "
        />
        <path
          stroke="none"
          fillRule="nonzero"
          fill={fill}
          fillOpacity={1}
          d="M 12.769531 8.59375 C 12.769531 8.617188 12.835938 8.6875 12.917969 8.769531 C 13.105469 8.933594 13.15625 9.058594 13.089844 9.175781 C 12.980469 9.382812 12.804688 9.386719 12.5625 9.195312 C 12.460938 9.117188 12.351562 9.0625 12.316406 9.074219 C 12.148438 9.140625 12.210938 9.714844 12.414062 9.972656 C 12.5625 10.15625 12.863281 10.300781 13.109375 10.304688 C 13.347656 10.304688 13.675781 10.128906 13.859375 9.898438 C 14.246094 9.40625 14.03125 8.769531 13.414062 8.605469 C 13.191406 8.546875 12.769531 8.539062 12.769531 8.59375 Z M 12.769531 8.59375 "
        />
        <path
          stroke="none"
          fillRule="nonzero"
          fill={fill}
          fillOpacity={1}
          d="M 11.835938 10.234375 C 11.824219 10.273438 11.867188 10.441406 11.933594 10.613281 C 12.023438 10.84375 12.046875 10.976562 12.027344 11.117188 C 11.996094 11.363281 12.082031 11.449219 12.246094 11.320312 C 12.335938 11.25 12.355469 11.191406 12.351562 11.007812 C 12.34375 10.558594 11.945312 9.960938 11.835938 10.234375 Z M 11.835938 10.234375 "
        />
        <path
          stroke="none"
          fillRule="nonzero"
          fill={fill}
          fillOpacity={1}
          d="M 9.839844 11.734375 C 9.839844 12.070312 10.140625 12.398438 10.683594 12.636719 C 10.921875 12.742188 11.035156 12.765625 11.363281 12.765625 C 11.683594 12.765625 11.773438 12.746094 11.890625 12.667969 C 11.960938 12.613281 12.035156 12.535156 12.039062 12.488281 C 12.058594 12.414062 12.035156 12.410156 11.832031 12.4375 C 11.710938 12.457031 11.453125 12.476562 11.257812 12.476562 C 10.808594 12.476562 10.59375 12.382812 10.382812 12.097656 C 9.980469 11.558594 9.839844 11.46875 9.839844 11.734375 Z M 9.839844 11.734375 "
        />
      </g>
    </svg>
  );
};