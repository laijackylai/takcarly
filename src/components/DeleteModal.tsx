import { useTheme } from "@react-navigation/native";
import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import Text from "@shared-components/text-wrapper/TextWrapper";
import Modal from "react-native-modal";
import { localStrings } from "shared/localization";
import createStyles from "./DeleteModal.style";

interface DeleteModalProps {
  isVisible: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isVisible,
  setVisibility,
  onDelete,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={100}
      animationOutTiming={100}
      isVisible={isVisible}
      onBackdropPress={() => setVisibility((ov) => !ov)}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
    >
      <View style={styles.delContainer}>
        <Text h2 color={colors.darkBlue}>
          {localStrings.deleteConfirmation}
        </Text>
        <View style={styles.btns}>
          <View style={styles.btn}>
            <TouchableOpacity onPress={() => setVisibility(false)}>
              <Text h3 bold color={colors.white}>
                {localStrings.cancel}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.delBtn}>
            <TouchableOpacity onPress={onDelete}>
              <Text h3 bold color={colors.white}>
                {localStrings.delete}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;
