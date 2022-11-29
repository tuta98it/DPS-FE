# DPS-FE (Digital Pathology Systems)
FE Angular project for DPS product.
***
# How to run
- Install packages: `npm i --force`
- Start: `npm start`
# Công nghệ sử dụng
- Angular 14
- UI components: PrimeNG 14 \
  https://www.primefaces.org/primeng-v14/setup \
  Project DPS-FE sử dụng các UI components của PrimeNG.
  *Example*:  
  Trong file `src/app/components/admin/list-users/list-users.module.ts` đã import một số module như: `FormsModule`, `ButtonModule`, `InputTextModule`,... 
  Khi cần sử dụng các module khác cho các component thuộc `ListUsersModule`, lập trình viên tìm kiếm <a href="https://www.primefaces.org/primeng-v14/setup">document của PrimeNG</a>, sau đó import tương tự các module đã dùng.
  *Note*: Import các module của PrimeNG và các thư viện khác vào module cần sử dụng của DPS-FE, thay vì sử dụng shared module.
- CSS classes: PrimeFlex 3 \
  https://www.primefaces.org/primeflex/ \
  <u>*Example*</u>:
  ```html
    <div class="hidden"></div>
  ```
  tương đương với
  ```html
    <div style="display: none;"></div>
  ```
- Icons:
  - PrimeIcons 6: https://www.primefaces.org/primeng-v14/icons
  - FontAwesome 6: https://fontawesome.com/v6/search
# Cấu trúc project
```
src
└─app
└─assets
| └─config
| └─images: ảnh logo, icon
| └─layout:
| | └─styles
| |   └─layout: css cho admin layout
| |   └─theme: css của một số mẫu theme
| └─styles
|   | theme.css: css của theme đang dùng cho DPS-FE
└─environment
└─html: các page sử dụng trong project qua iframe (slide viewer, print template)
```
**Note**: Không tùy ý thay đổi file theme.css