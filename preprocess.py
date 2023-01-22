import linpg
import glob
import os


def preprocess(pathIn: str, dataIn: dict[str, list[str]]):
    for _path in glob.glob(os.path.join(pathIn, "*")):
        assert isinstance(_path, str)
        if os.path.isdir(_path):
            preprocess(_path, _data)
        elif _path.endswith(".json"):
            dataIn["jsons"].append("./" + _path.replace("\\", "/"))
            # linpg.config.organize(_path)
        elif _path.endswith(".png") or _path.endswith(".jpg"):
            dataIn["images"].append("./" + _path.replace("\\", "/"))


_data: dict[str, list[str]] = {"jsons": [], "images": []}

# document all images and json in images folder
preprocess("images", _data)
# document all images and json in levels folder
preprocess("levels", _data)

linpg.config.save("./additional.json", _data)
