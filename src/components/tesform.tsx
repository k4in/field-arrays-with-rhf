import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// 1. Define the Zod schema for validation
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  fruit: z.enum(['apple', 'banana', 'orange'], {
    errorMap: () => ({ message: 'Please select a fruit' }),
  }),
  times: z
    .array(
      z.object({
        start: z.string().min(1, 'Start time is required'),
        end: z.string().min(1, 'End time is required'),
        dinner: z.string().min(1, 'Dinner plan is required'),
      })
    )
    .min(1, 'At least one time entry is required'), // Ensure at least one entry
});

// Infer the TypeScript type from the schema
type FormValues = z.infer<typeof formSchema>;

// Define default values that match the schema structure
const defaultValues: FormValues = {
  name: 'John Doe',
  fruit: 'apple',
  times: [
    { start: '09:00', end: '17:00', dinner: 'Pasta' },
    { start: '18:00', end: '22:00', dinner: 'Salad' },
  ],
};

// The Form Component
function MyForm() {
  const {
    register,
    control, // control is needed for useFieldArray and Controller
    handleSubmit,
    formState: { errors },
    watch, // Optional: to see form values change
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues, // Set default values
  });

  // 2. Initialize useFieldArray
  // - 'control' links it to the main form state.
  // - 'name' specifies which field in your form data is the array.
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'times',
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form Submitted:', data);
    alert('Form submitted! Check the console for data.');
  };

  // Optional: Log form values on change
  // React.useEffect(() => {
  //   const subscription = watch((value) => console.log('Form values:', value));
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}
    >
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>My Form</h3>

      {/* Name Field */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>
          Name:
        </label>
        <input id="name" {...register('name')} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        {errors.name && <p style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>{errors.name.message}</p>}
      </div>

      {/* Fruit Select */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="fruit" style={{ display: 'block', marginBottom: '5px' }}>
          Favorite Fruit:
        </label>
        <select id="fruit" {...register('fruit')} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
          <option value="">-- Select Fruit --</option>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
        {errors.fruit && <p style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>{errors.fruit.message}</p>}
      </div>

      {/* Times Field Array */}
      <div style={{ marginBottom: '15px', border: '1px dashed #eee', padding: '15px', borderRadius: '4px' }}>
        <h4 style={{ marginTop: '0', marginBottom: '10px' }}>Time Entries:</h4>
        {/* 3. Map over the 'fields' array */}
        {/* - 'fields' is an array provided by useFieldArray. Each item represents a row in your array. */}
        {/* - It's important to use 'field.id' as the key for React's reconciliation process. DO NOT use index. */}
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: '15px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <div style={{ flexGrow: 1 }}>
              {/* 4. Register inputs within the array */}
              {/* - The name uses dot notation: `arrayName.${index}.fieldName` */}
              {/* - This tells react-hook-form how to structure the data. */}
              <div style={{ marginBottom: '5px' }}>
                <label
                  htmlFor={`times.${index}.start`}
                  style={{ display: 'block', marginBottom: '3px', fontSize: '0.9em' }}
                >
                  Start Time:
                </label>
                <input
                  id={`times.${index}.start`}
                  {...register(`times.${index}.start`)}
                  placeholder="e.g., 09:00"
                  style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
                />
                {errors.times?.[index]?.start && (
                  <p style={{ color: 'red', fontSize: '0.8em', margin: '3px 0 0 0' }}>
                    {errors.times[index]?.start?.message}
                  </p>
                )}
              </div>
              <div style={{ marginBottom: '5px' }}>
                <label
                  htmlFor={`times.${index}.end`}
                  style={{ display: 'block', marginBottom: '3px', fontSize: '0.9em' }}
                >
                  End Time:
                </label>
                <input
                  id={`times.${index}.end`}
                  {...register(`times.${index}.end`)}
                  placeholder="e.g., 17:00"
                  style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
                />
                {errors.times?.[index]?.end && (
                  <p style={{ color: 'red', fontSize: '0.8em', margin: '3px 0 0 0' }}>
                    {errors.times[index]?.end?.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={`times.${index}.dinner`}
                  style={{ display: 'block', marginBottom: '3px', fontSize: '0.9em' }}
                >
                  Dinner Plan:
                </label>
                <input
                  id={`times.${index}.dinner`}
                  {...register(`times.${index}.dinner`)}
                  placeholder="e.g., Pizza"
                  style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
                />
                {errors.times?.[index]?.dinner && (
                  <p style={{ color: 'red', fontSize: '0.8em', margin: '3px 0 0 0' }}>
                    {errors.times[index]?.dinner?.message}
                  </p>
                )}
              </div>
            </div>
            {/* 5. Remove button */}
            {/* - Calls the 'remove' function provided by useFieldArray, passing the index. */}
            <button
              type="button"
              onClick={() => remove(index)}
              style={{
                padding: '5px 10px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                alignSelf: 'center',
                height: 'fit-content',
              }}
            >
              Remove
            </button>
          </div>
        ))}
        {/* 6. Add button */}
        {/* - Calls the 'append' function provided by useFieldArray. */}
        {/* - Pass an object with the default structure for a new item. */}
        <button
          type="button"
          onClick={() => append({ start: '', end: '', dinner: '' })}
          style={{
            padding: '8px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          Add Time Entry
        </button>
        {errors.times?.root && (
          <p style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>{errors.times.root.message}</p>
        )}
        {errors.times && typeof errors.times === 'object' && !Array.isArray(errors.times) && errors.times.message && (
          <p style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>{errors.times.message}</p>
        )}
      </div>

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1em',
        }}
      >
        Submit Form
      </button>
    </form>
  );
}

export default MyForm;
