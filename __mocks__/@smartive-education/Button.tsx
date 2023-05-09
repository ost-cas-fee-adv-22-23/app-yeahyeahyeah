export const Button = ({
  label = 'Button Label',
  color = 'slate',
  size = 'small',
  width = 'default',
  type = 'button',
  disabled = false,
  onClick = () => {},
  icon = 'none',
}) => {
  return (
    <button>
      {label}
      {icon !== 'none' && <>Icon</>}
    </button>
  );
};
