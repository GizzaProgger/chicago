const modal = document.querySelector("div.overlay");
const body = document.querySelector("body");

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("modal-open")) {
    modal.style.display = "flex";
    body.style.overflow = "hidden";
  }

  if (e.target.classList.contains("modal-close")) {
    modal.style.display = "none";
    body.style.overflow = "visible";
  }

  if (e.target.classList.contains("overlay")) {
    modal.style.display = "none";
    body.style.overflow = "visible";
  }
});

const formFactory = () => {
  let o = {
    init() {
      self.emailSendInit();
      self.crmSendInit();
      self.sendPulseInit();
    },
    emailSendInit() {
      document.querySelectorAll("form[data-name]").forEach((form) => {
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          let msg = await self.msgFromForm(form);
          let formData = self.objectToFormData({
            auth_token:
              "qz_BX&f-~QEta'kl:H+3Qsc$*Q'/kvjDsdfdf3AETdOMr'z}[(<F2q8,]<*e?P:]Mf",
            label: "Заявка с сайта",
            msg,
            mails: "n.davydova@chicaga.ru,147rawil147@gmail.com",
          });
          let r = await fetch("https://chicaga.ru/rest/mail", {
            method: "POST",
            body: formData,
          });

          r = await r.json();
          if (r.code === 200)
            location.href = `https://chicaga.ru/thank-online/`;
        });
      });
    },
    cript(str) {
      return str
        .split("")
        .map((value) => value.charCodeAt())
        .join("|");
    },
    async crmSendInit() {
      let forms = document.querySelectorAll("form");
      if (!forms) return;
      forms.forEach((form) => {
        if (form.dataset.noCrm) return;
        form.addEventListener("submit", async () => {
          let name = form.querySelector("[data-crm-name]");
          let phone = form.querySelector("[data-crm-tel]");
          phone = phone || form.querySelector("[type='tel']");
          let school = form.querySelector("[data-crm-school]");
          let timedate = form.querySelector("[data-crm-timedate]");
          timedate = timedate ? timedate.value : false;
          let date = form.querySelector("[data-crm-date]");
          date = date ? date.value : false;
          let time = form.querySelector("[data-crm-time]");
          time = time ? time.value : false;
          let question = form.querySelector("[data-crm-question]");
          question = question ? question.value : false;
          let contact = form.querySelector("[data-crm-contact]");
          contact = contact ? contact.value : false;
          let query = self.objectToFormData({
            name: name ? name.value : "",
            phone: phone ? phone.value : "",
            website: location.href,
            school: school ? school.value : "",
            utm: getCookie("utm_info") || "",
            ref: getCookie("ref_info") || "",
            comment: `
              Позвонить - дата: ${date ? date : "Не указано"} \n
              Позвонить - время: ${time ? time : "Не указано"} \n
              Позвонить - комментарий: ${timedate ? timedate : "Не указано"} \n
              Ответить на вопрос - как: ${contact ? contact : "Не указан"} \n
              Вопрос: ${question ? question : "Не указан"} \n
            `,
            date: date.value,
          });
          let r = await fetch(
            "https://chicaga.ru/assets/components/project/app/php_scripts/create_lead.php",
            {
              method: "POST",
              body: query,
            }
          );

          if (!r.ok) {
            let formData = self.objectToFormData({
              auth_token:
                "qz_BX&f-~QEta'kl:H+3Qsc$*Q'/kvjDsdfdf3AETdOMr'z}[(<F2q8,]<*e?P:]Mf",
              label: "Не доставить данные в crm",
              msg: `E-mail: ${phone || "отсутвует"} \br Id книги: ${
                name || "отсутвует"
              }`,
            });
            fetch("https://chicaga.ru/rest/mail", {
              method: "POST",
              body: formData,
            });
          }
        });
      });
    },
    sendPulseInit() {
      let forms = document.querySelectorAll("form[data-sendpulse-book]");
      if (!forms) return;
      forms.forEach((form) => {
        form.addEventListener("submit", () => self.addMailToPulse(form));
      });
    },
    async msgFromForm(form) {
      let msg = "Заявка со страницы:" + location.href + "<br>";
      let formTitle = form.dataset.name;
      if (formTitle) msg += `<br>Название формы: ${formTitle}<br>`;
      form.querySelectorAll("input, select, textarea").forEach((el) => {
        let label = el.dataset.name || el.dataset.label;
        let value = el.value;
        if (
          el.getAttribute("type") == "checkbox" ||
          el.getAttribute("type") == "radio"
        ) {
          value = el.checked ? el.value : "";
        }
        if (!label || !value) return;
        msg += `${label}: ${value}<br>`;
      });
      msg += await self.getUTMInfo();
      return msg;
    },
    async getUTMInfo() {
      try {
        let r = await fetch(
          "https://chicaga.ru/assets/components/project/app/php_scripts/get_utm_info_text.php",
          {
            method: "POST",
            body: this.objectToFormData({
              utm_info: decodeURI(getCookie("utm_info") || ""),
              ref_info: decodeURI(getCookie("ref_info") || ""),
            }),
          }
        );
        return await r.text();
      } catch (e) {
        return new Promise(() => {});
      }
    },
    async addMailToPulse(form) {
      if (!form.dataset.sendpulseBook) return;
      let email = form.querySelector("[type='email']");
      if (!email) return;
      let name = form.querySelector("[data-sendpulse-name]");
      let phone = form.querySelector("[type='tel']");
      let mailData = {
        email: email.value,
        variables: {
          Имя: name ? name.value : "",
          Phone: phone ? phone.value : "",
        },
      };
      let r = await fetch(
        "https://chicaga.ru/assets/components/project/app/php_scripts/add_email_to_book.php",
        {
          method: "POST",
          body: self.objectToFormData({
            adding_mail: JSON.stringify({
              emails: [mailData],
            }),
            book_id: form.dataset.sendpulseBook,
          }),
        }
      );
      if (!r.ok) {
        let formData = self.objectToFormData({
          auth_token:
            "qz_BX&f-~QEta'kl:H+3Qsc$*Q'/kvjDsdfdf3AETdOMr'z}[(<F2q8,]<*e?P:]Mf",
          label: "Не удалось записать контакт в адрессную книгу sendpulse",
          msg: `E-mail: ${email.value || "отсутвует"} \br Id книги: ${
            form.dataset.sendpulseBook || "отсутвует"
          }`,
        });
        await fetch("https://chicaga.ru/rest/mail", {
          method: "POST",
          body: formData,
        });
      }
    },
    getQuery(form) {
      let q = "";
      form.querySelectorAll("input, select, textarea").forEach((el) => {
        let label = el.dataset.name || el.dataset.label;
        if (!label) return;
        q += `${label}=${el.value}&`;
      });
      return q;
    },
    getUrlVars(form) {
      let acc = "";
      form.querySelectorAll("[data-js-var-url]").forEach((v) => {
        acc += `${v.dataset.jsVarUrl}:${v.value}~`;
      });
      return acc.slice(0, acc.length - 1);
    },
    objectToFormData(obj) {
      let formData = new FormData();
      for (const key in obj) {
        formData.append(key, obj[key]);
      }
      return formData;
    },
  };
  let self = o;
  return o;
};
formFactory().init();
function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

const swiper = new Swiper(".swiper", {
  slidesPerView: 1.5,
  spaceBetween: 0,
  centeredSlides: true,
  preventClicks: true,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
  },
  // autoplay: {
  //     delay: 2500,
  //     disableOnInteraction: false,
  //   },
});
