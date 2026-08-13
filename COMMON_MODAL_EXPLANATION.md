# CommonModal Explanation

## What is CommonModal?

CommonModal is a reusable popup dialog component used to show content in a sliding panel style.

It is mainly used for things like:
- mobile navigation menus
- side drawers
- confirmation popups
- custom content panels

In this project, it is used by the navbar to show a mobile menu when the menu button is clicked.

---

## Why was it created?

Instead of writing a modal UI again and again for every feature, this component was made once and reused whenever a popup or drawer is needed.

This helps with:
- consistency
- cleaner code
- faster development
- easier maintenance

---

## What does it do?

CommonModal provides:
- an overlay background behind the modal
- a sliding panel from the right side
- optional title bar
- optional close button
- custom content inside the modal
- optional footer buttons

So it acts like a flexible wrapper for any content you want to show in a popup style.

---

## How does it work?

The component receives props such as:
- show: controls whether the modal is visible
- setShow: function used to close or open the modal
- mainContent: the content to display inside the modal
- modalTitle: title displayed at the top
- showModalTitle: determines whether to show the title area
- showButtons: determines whether to show footer buttons
- buttonComponent: custom buttons for the footer

When show is true, the modal appears. When setShow(false) is called, it closes.

---

## How can you use it?

### Basic example

```jsx
<CommonModal
  show={showModal}
  setShow={setShowModal}
  showModalTitle={true}
  modalTitle="My Modal"
  mainContent={<div>Some content here</div>}
/>
```

### Example with custom buttons

```jsx
<CommonModal
  show={showModal}
  setShow={setShowModal}
  showModalTitle={true}
  modalTitle="Confirm Action"
  showButtons={true}
  buttonComponent={<button>Submit</button>}
  mainContent={<p>Are you sure?</p>}
/>
```

---

## What each prop means

### show
Tells the modal whether it should be visible.

### setShow
A state setter function used to change the modal visibility.

### mainContent
The main body content displayed inside the modal.

### modalTitle
The title shown at the top if enabled.

### showModalTitle
If true, the title bar and close button are shown.

### showButtons
If true, the footer button area is shown.

### buttonComponent
Custom footer content such as buttons.

---

## Line-by-line explanation of the component

### 1. "use client"
This tells Next.js that this file should run on the client side, because it uses React state and UI behavior.

### 2. Importing Headless UI components
```jsx
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
```
These imports bring in the building blocks for the modal and its animation.

- Dialog: the main popup container
- DialogPanel: the visible panel inside the dialog
- DialogTitle: the title section
- Transition: handles animation states
- TransitionChild: handles the animation of inner parts like the overlay and panel

### 3. Importing Fragment
```jsx
import { Fragment } from "react";
```
Fragment is used so multiple elements can be returned without adding extra wrapper nodes.

### 4. Component function declaration
```jsx
export default function CommonModal({
  modalTitle,
  mainContent,
  showButtons,
  buttonComponent,
  show,
  setShow,
  showModalTitle,
}) {
```
This defines the component and accepts props from the parent component.

Each prop is used to control the modal's behavior and content.

### 5. Return statement
```jsx
return (
```
This starts the JSX that will be rendered to the screen.

### 6. Transition wrapper
```jsx
<Transition show={show} as={Fragment}>
```
This makes the modal appear and disappear smoothly.

- show={show} means the modal opens or closes based on the parent state
- as={Fragment} means it renders without adding an extra DOM wrapper

### 7. Dialog container
```jsx
<Dialog as="div" className="relative z-10" onClose={setShow}>
```
This creates the dialog container.

- as="div" makes it render as a normal div element
- className="relative z-10" sets stacking order so it appears above other content
- onClose={setShow} makes the modal close when the dialog is dismissed

### 8. Background overlay transition
```jsx
<TransitionChild
  as={Fragment}
  enter="ease-in-out duration-300"
  enterFrom="opacity-0"
  enterTo="opacity-100"
  leave="ease-in-out duration-200"
  leaveFrom="opacity-100"
  leaveTo="opacity-0"
>
```
This controls the fade-in and fade-out effect of the background overlay.

### 9. Overlay div
```jsx
<div className="fixed inset-0 bg-gray-500/75" />
```
This creates the dark semi-transparent backdrop behind the modal.

- fixed inset-0 makes it cover the full screen
- bg-gray-500/75 gives it a gray overlay with transparency

### 10. Modal container wrapper
```jsx
<div className="fixed inset-0 overflow-hidden">
```
This creates the full-screen modal container and ensures content does not overflow unexpectedly.

### 11. Inner wrapper
```jsx
<div className="absolute inset-0 overflow-hidden">
```
This positions the panel inside the full-screen container.

### 12. Sliding panel area
```jsx
<div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
```
This positions the modal panel on the right side of the screen.

- inset-y-0 means full height
- right-0 aligns it to the right
- pl-10 adds left padding

### 13. Second TransitionChild for sliding animation
```jsx
<TransitionChild
  as={Fragment}
  enter="transform transition ease-in-out duration-300"
  enterFrom="translate-x-full"
  enterTo="translate-x-0"
  leave="transform transition ease-in-out duration-200"
  leaveFrom="translate-x-0"
  leaveTo="translate-x-full"
>
```
This makes the modal panel slide in from the right side and slide back out.

### 14. DialogPanel
```jsx
<DialogPanel className="w-screen max-w-md">
```
This is the visible box that holds the modal content.

- w-screen max-w-md makes it take most of the screen width but not exceed a medium size

### 15. Main modal body container
```jsx
<div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
```
This creates the actual panel background and layout.

- flex h-full makes it fill the panel height
- flex-col stacks its children vertically
- overflow-y-auto allows scrolling if content becomes tall
- bg-white gives it a white background
- shadow-xl adds a strong shadow

### 16. Content area container
```jsx
<div className="flex-1 px-4 py-6 sm:px-6">
```
This is the main content section.

- flex-1 makes it take the available vertical space
- px-4 py-6 adds padding

### 17. Conditional title block
```jsx
{showModalTitle && (
```
This checks whether the title should be displayed.

If showModalTitle is true, the title section appears.

### 18. Title row
```jsx
<div className="flex justify-between items-center">
```
This arranges the title and close button in one row.

### 19. DialogTitle
```jsx
<DialogTitle className="text-lg font-semibold">
  {modalTitle}
</DialogTitle>
```
This renders the title text inside the modal.

### 20. Close button
```jsx
<button
  onClick={() => setShow(false)}
  className="text-gray-500 hover:text-black"
>
  ✕
</button>
```
This adds a close button.

- onClick={() => setShow(false)} closes the modal
- hover effect helps the button feel interactive

### 21. Main content placement
```jsx
<div className="mt-20">{mainContent}</div>
```
This renders the custom content passed by the parent.

- mt-20 adds spacing from the top

### 22. Conditional footer area
```jsx
{showButtons && (
```
This only renders the footer area when showButtons is true.

### 23. Footer container
```jsx
<div className="px-4 py-6 sm:px-6 border-t">
```
This creates the footer section with a top border.

### 24. Footer buttons content
```jsx
{buttonComponent}
```
This displays any custom button content passed from the parent.

### 25. Closing tags
The rest of the file closes the structure of:
- DialogPanel
- TransitionChild
- wrapper divs
- Dialog
- Transition

These closing tags simply end the layout structure that was opened earlier.

---

## In this project

In this app, CommonModal is used inside the navbar.

It is used to show a mobile navigation menu when the hamburger button is clicked.

The flow is:
1. the navbar button is clicked
2. setShowNavModal(true) runs
3. CommonModal opens
4. the navigation links are shown inside the modal
5. the user can close it again

This is an example of how a reusable modal can improve mobile navigation.

---

## Important note

This component is currently flexible, but it depends on parent components to manage its open/close state.

That means you must control it from a parent component using state like this:

```jsx
const [showModal, setShowModal] = useState(false);
```

---

## Summary

CommonModal is a reusable, flexible modal/drawer component that helps you show popup content in a clean and consistent way.

It is useful when you want to:
- show menus
- create drawers
- display forms
- show confirmation dialogs
- present extra content without leaving the page

If you want, I can also create a second markdown file showing a real example using this component inside the navbar step by step.
