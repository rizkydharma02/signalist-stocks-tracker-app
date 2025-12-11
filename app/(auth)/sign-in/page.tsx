'use client';

import { useForm, SubmitHandler } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from '@/components/forms/FooterLink';
import { useRouter } from 'next/navigation';
import { signInWithEmail } from '@/lib/actions/auth.actions';

const SignUp = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<SignInFormData> = async (data: SignInFormData) => {
    try {
      const result = await signInWithEmail(data);
      if (result.success) router.push('/');
    } catch (e) {
      console.log('Sign in failed', e);
    }
  };

  return (
    <>
      <h1 className="form-title">Welcome Back</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          name="email"
          label="Email"
          placeholder="john@doe.com"
          type="email"
          register={register}
          error={errors.email}
          validation={{ required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' } }}
        />
        <InputField
          name="password"
          label="Password"
          placeholder="Enter a strong password"
          type="password"
          register={register}
          error={errors.password}
          validation={{ required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters long' } }}
        />

        <Button type="submit" disabled={isSubmitting} className="mt-5 w-full yellow-btn">
          {isSubmitting ? 'Signing In' : 'Sign In'}
        </Button>

        <FooterLink text="Don't have an account?" linkText="Sign Up" href="/sign-up" />
      </form>
    </>
  );
};

export default SignUp;
