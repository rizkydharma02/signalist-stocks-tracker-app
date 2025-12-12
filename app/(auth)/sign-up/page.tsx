'use client';

import { useForm, SubmitHandler } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import SelectField from '@/components/forms/SelectField';
import { CountrySelectField } from '@/components/forms/CountrySelectField';
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from '@/lib/constants';
import FooterLink from '@/components/forms/FooterLink';
import { toast } from 'sonner';
import { signUpWithEmail } from '@/lib/actions/auth.actions';
import { useRouter } from 'next/navigation';

const SignUp = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      country: '',
      investmentGoals: 'Growth',
      riskTolerance: 'Medium',
      preferredIndustry: 'Technology',
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<SignUpFormData> = async (data: SignUpFormData) => {
    try {
      const result = await signUpWithEmail(data);
      if (result.success) router.push('/');
    } catch (e) {
      toast.error('Sign up failed', {
        description: e instanceof Error ? e.message : 'Failed to create an account',
      });
      console.log(e);
    }
  };

  return (
    <>
      <h1 className="form-title">Sign Up & Personalise</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          name="fullName"
          label="Full Name"
          placeholder="John Doe"
          register={register}
          error={errors.fullName}
          validation={{ required: 'Full name is required', minLength: { value: 2, message: 'Full name must be at least 2 characters long' } }}
        />
        <InputField
          name="email"
          label="Email"
          placeholder="john@doe.com"
          type="email"
          register={register}
          error={errors.email}
          validation={{ required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' } }}
        />
        <CountrySelectField name="country" label="Country" control={control} error={errors.country} />
        <InputField
          name="password"
          label="Password"
          placeholder="Enter a strong password"
          type="password"
          register={register}
          error={errors.password}
          validation={{ required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters long' } }}
        />
        <SelectField name="investmentGoals" label="Investment Goals" placeholder="Select your investment goal" options={INVESTMENT_GOALS} control={control} error={errors.investmentGoals} />
        <SelectField name="riskTolerance" label="Risk Tolerance" placeholder="Select your risk level" options={RISK_TOLERANCE_OPTIONS} control={control} error={errors.riskTolerance} />
        <SelectField name="preferredIndustry" label="Preferred Industry" placeholder="Select your preferred industry" options={PREFERRED_INDUSTRIES} control={control} error={errors.preferredIndustry} />

        <Button type="submit" disabled={isSubmitting} className="mt-5 w-full yellow-btn">
          {isSubmitting ? 'Creating Account' : 'Start Your Investment Journey'}
        </Button>

        <FooterLink text="Already have an account?" linkText="Sign In" href="/sign-in" />
      </form>
    </>
  );
};

export default SignUp;
