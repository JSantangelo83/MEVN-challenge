import Swal from 'sweetalert2';
import { User, UserPassword } from '../services/UsersService';

export const swalError = (title: string, text: string) => Swal.fire({
    icon: "error",
    title: title,
    text: text,
});

export const swalSuccess = (text: string) => Swal.fire({
    icon: "success",
    title: "Success!",
    text: text,
});

export const swalUserForm = async (user?: User): Promise<UserPassword | null> => {
    const { value: userData } = await Swal.fire({
        title: `${user ? 'Edit' : 'Create'} User`,
        html: `
          <input id="swal-username" class="swal2-input" value="${user?.username || ''}" placeholder="${user?.username || 'Enter a Username...'}">
          <input id="swal-password" class="swal2-input" type="password" placeholder="Enter ${user ? 'a new' : 'a'} password">
          <input id="swal-password2" class="swal2-input" type="password" placeholder="Re-Enter the password">
          <div class="form-check">
          <input class="form-check-input" type="checkbox" checked="${user?.isAdmin || false}" id="swal-isAdmin">
          <label class="form-check-label" for="checkbox1">
              Is Admin
          </label>
      </div>
        `,
        focusConfirm: false,
        preConfirm: () => {
            let username = ((document as Document).getElementById("swal-username") as HTMLInputElement)?.value
            let password1 = ((document as Document).getElementById("swal-password") as HTMLInputElement)?.value
            let password2 = ((document as Document).getElementById("swal-password2") as HTMLInputElement)?.value
            let isAdmin = ((document as Document).getElementById("swal-isAdmin") as HTMLInputElement)?.checked

            let errorMsg = '';
            if (password1 !== password2) {
                errorMsg = 'Passwords do not match'
            }
            if (!password2) {
                errorMsg = 'You need to re-enter the password'
            }
            if (!password1) {
                errorMsg = 'You need to enter a password'
            }
            if (!username) {
                errorMsg = 'You need to enter a username'
            }
            if (errorMsg) {
                Swal.showValidationMessage(errorMsg)
            } else {
                return {
                    username: username,
                    password: password1,
                    isAdmin: isAdmin
                }
            }
        }
    });
    if (userData) {
        return (user ? { id: user.id, ...userData } : userData) as UserPassword;
    }
    return null;
}
