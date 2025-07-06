import { Control, Controller, FieldErrors, Path } from "react-hook-form";
import { NumericFormat } from "react-number-format";


// eslint-disable-next-line
interface CurrencyInputProps<T extends Record<string, any>>{
  placeholder?: string;
  control: Control<T>;
  name: Path<T>;
  errors: FieldErrors<T>;
  disabled?: boolean;
  label?: string;
  lableRequired?: boolean;
}


// eslint-disable-next-line
function CurrencyInput<T extends Record<string, any>>(props: CurrencyInputProps<T>) {
  return (
    <div className="form-group mb-4">
      {props.label && 
        <label className="text-black" htmlFor={props.name}>
          {props.label} {props.lableRequired && <span className="text-danger">*</span>}
        </label>
      }
      
      <Controller 
        name={props.name}
        control={props.control}
        render={({field: {ref, onChange, ...fieldProps} }) => (
          <NumericFormat
            className={`form-control ${props.errors[props.name] ? 'is-invalid' : ''}`}
            thousandSeparator="."
            decimalSeparator=","
            prefix="Rp"
            {...fieldProps}
            getInputRef={ref}
            disabled={props.disabled}
            onValueChange={(values) => {
              const numericValues = values.floatValue ?? 0;
              onChange(numericValues)
            }}
          />
        )}
      
      />
      
        <div className={`text-danger ${props.errors[props.name] ? '' : 'hidden'}`} style={{height: 8}}>
          <small>{(props.errors[props.name]?.message as string | null) ?? ''}</small>
        </div>
    </div>
  )
}

export default CurrencyInput