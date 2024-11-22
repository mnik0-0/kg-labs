import cv2
import numpy as np
from tkinter import Tk, Button, Label, filedialog
from PIL import Image, ImageTk

class ImageProcessorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Приложение для обработки изображений")


        self.load_button = Button(root, text="Загрузить изображение", command=self.load_image)
        self.load_button.pack()

        self.show_original_button = Button(root, text="Показать исходное изображение", command=self.show_original_image)
        self.show_original_button.pack()

        self.gaussian_button = Button(root, text="Применить фильтр Гаусса", command=self.apply_gaussian_blur)
        self.gaussian_button.pack()

        self.median_button = Button(root, text="Применить медианный фильтр", command=self.apply_median_blur)
        self.median_button.pack()

        self.bernsen_thresh_button = Button(root, text="Пороговое значение Бернсена", command=self.apply_bernsen_threshold)
        self.bernsen_thresh_button.pack()

        self.niblack_thresh_button = Button(root, text="Пороговое значение Ниблэка", command=self.apply_niblack_threshold)
        self.niblack_thresh_button.pack()


        self.image_label = Label(root)
        self.image_label.pack()

        self.image = None
        self.processed_image = None

    def load_image(self):
        file_path = filedialog.askopenfilename()
        if file_path:
            self.image = cv2.imread(file_path)
            self.display_image(self.image)

    def show_original_image(self):
        if self.image is not None:
            self.display_image(self.image)

    def display_image(self, img):
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img_pil = Image.fromarray(img_rgb)
        img_tk = ImageTk.PhotoImage(img_pil)
        self.image_label.config(image=img_tk)
        self.image_label.image = img_tk

    def apply_gaussian_blur(self):
        if self.image is not None:
            self.processed_image = cv2.GaussianBlur(self.image, (5, 5), 0)
            self.display_image(self.processed_image)

    def apply_median_blur(self):
        if self.image is not None:
            self.processed_image = cv2.medianBlur(self.image, 5)
            self.display_image(self.processed_image)

    def apply_bernsen_threshold(self):
        if self.image is not None:
            gray_image = cv2.cvtColor(self.image, cv2.COLOR_BGR2GRAY)
            r = 15
            epsilon = 15


            self.processed_image = cv2.ximgproc.niBlackThreshold(
                gray_image, maxValue=255, type=cv2.THRESH_BINARY, blockSize=r, k=-epsilon/255
            )
            self.display_image(cv2.cvtColor(self.processed_image, cv2.COLOR_GRAY2RGB))

    def apply_niblack_threshold(self):
        if self.image is not None:
            gray_image = cv2.cvtColor(self.image, cv2.COLOR_BGR2GRAY)
            window_size = 15
            k = -0.2


            self.processed_image = cv2.ximgproc.niBlackThreshold(
                gray_image, maxValue=255, type=cv2.THRESH_BINARY, blockSize=window_size, k=k
            )
            self.display_image(cv2.cvtColor(self.processed_image, cv2.COLOR_GRAY2RGB))


if __name__ == "__main__":
    root = Tk()
    app = ImageProcessorApp(root)
    root.mainloop()
