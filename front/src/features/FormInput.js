import {
    FormHelperText,
    Typography,
    FormControl,
    Input as _Input, TextField
} from "@mui/material"
import {styled} from "@mui/material/styles"
import {Controller, useFormContext} from "react-hook-form"

const Input = styled(_Input)`
  background-color: white;
  padding: 0.4rem 0.7rem;
`

const FormInput = ({name, label, iref, ...otherProps}) => {
    const {
        control,
        formState: {errors}
    } = useFormContext()

    return (
        <Controller
            control={control}
            defaultValue=""
            name={name}
            render={({field}) => (
                <FormControl fullWidth sx={{mb: 2}}>
                    <TextField
                        ref={iref}
                        label={label}
                        {...field}
                        fullWidth
                        inputProps={{
                            autoComplete: 'new-password',
                            form: {
                                autoComplete: 'off',
                            },
                        }}
                        sx={{borderRadius: "1rem", mt: 2, backgroundColor: '#fff'}}
                        error={!!errors[name]}
                        {...otherProps}
                    />
                    <FormHelperText error={!!errors[name]}>
                        {errors[name] ? errors[name].message : ""}
                    </FormHelperText>
                </FormControl>
            )}
        />
    )
}

export default FormInput
