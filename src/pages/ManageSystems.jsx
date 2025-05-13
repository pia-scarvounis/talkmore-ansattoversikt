import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMetaData } from "../redux/slices/metaDataCrudsSlice";
import {
  updateLicense,
  createLicense,
  deleteLicense,
} from "../redux/slices/AdminSlices/adminLicenseCruds";

import NavAdmin from "../components/navigation/NavAdmin";
import PageHeader from "../components/UI/PageHeader";
import GreenButton from "../components/UI/GreenButton";
import RedButton from "../components/UI/RedButton";
import WhiteButton from "../components/UI/WhiteButton";
import AlertBox from "../components/UI/AlertBox";

import "../styles/form.css";
import "../styles/buttons.css";

const ManageSystems = () => {
  const dispatch = useDispatch();
  const { licenses } = useSelector((state) => state.metaData);

  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [saveType, setSaveType] = useState("");

  // Separate tilstander for hver seksjon
  const [selectedLicenseEdit, setSelectedLicenseEdit] = useState("");
  const [newLicenseNameEdit, setNewLicenseNameEdit] = useState("");

  const [newLicenseNameCreate, setNewLicenseNameCreate] = useState("");

  const [selectedLicenseDelete, setSelectedLicenseDelete] = useState("");

  // Tilstander for suksess- og feilmeldinger
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createError, setCreateError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    dispatch(fetchMetaData());
  }, [dispatch]);

  const handleSave = (type) => {
    setSaveType(type);
    setShowSaveAlert(true);
  };

  const confirmSave = () => {
    setShowSaveAlert(false);
    if (saveType === "leggtil") {
      if (!newLicenseNameCreate) {
        setCreateError("Du må skrive inn systemnavn.");
        return;
      }

      dispatch(createLicense({ license_title: newLicenseNameCreate }))
        .unwrap()
        .then(() => {
          setCreateSuccess(true);
          setNewLicenseNameCreate("");
          console.log("Lisens opprettet med suksess.");
        })
        .catch((error) => {
          console.error("Feil ved opprettelse:", error);
          setCreateError(
            error.message || "Det oppstod en feil ved opprettelse."
          );
        });
    }
  };

  const confirmDelete = () => {
    setShowDeleteAlert(false);
    if (!selectedLicenseDelete) {
      setDeleteError("Du må velge et system å slette.");
      return;
    }

    dispatch(deleteLicense(selectedLicenseDelete))
      .unwrap()
      .then(() => {
        setDeleteSuccess(true);
        setSelectedLicenseDelete("");
      })
      .catch(() => {
        setDeleteError("Det oppstod en feil ved sletting.");
      });
  };

  // Success- og feilmeldinger fjernes automatisk etter 3 sekunder
  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => setUpdateSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (createSuccess) {
      const timer = setTimeout(() => setCreateSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [createSuccess]);

  useEffect(() => {
    if (deleteSuccess) {
      const timer = setTimeout(() => setDeleteSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteSuccess]);

  return (
    <div className="form-page">
      <NavAdmin />
      <div className="form-content page-header-wrapper">
        <PageHeader title="Administrer Systemer" />

        {/* Endre Systemnavn */}
        <div className="form-section team-box">
          <h2 className="section-heading">Endre Systemnavn</h2>
          <div className="two-column">
            <div className="column">
              <label>Velg System</label>
              <select
                value={selectedLicenseEdit}
                onChange={(e) => setSelectedLicenseEdit(e.target.value)}
              >
                <option value="">Velg system</option>
                {licenses.map((license) => (
                  <option key={license.license_id} value={license.license_id}>
                    {license.license_title}
                  </option>
                ))}
              </select>
            </div>
            <div className="column">
              <label>Skriv inn nytt navn for systemet</label>
              <input
                type="text"
                value={newLicenseNameEdit}
                onChange={(e) => setNewLicenseNameEdit(e.target.value)}
              />
            </div>
          </div>
          <div className="manage-teams-buttons">
            <GreenButton text="Lagre" onClick={() => handleSave("lagre")} />
          </div>

          {/* AlertBox for oppdatering */}
          {updateSuccess && (
            <AlertBox
              type="success"
              title="Oppdatert!"
              message="Systemnavnet ble oppdatert."
            />
          )}
          {updateError && (
            <AlertBox type="error" title="Feil" message={updateError}>
              <RedButton text="Lukk" onClick={() => setUpdateError("")} />
            </AlertBox>
          )}
        </div>

        {/* Opprett nytt System */}
        <div className="form-section team-box">
          <h2 className="section-heading">Opprett nytt System</h2>
          <div className="two-column">
            <div className="column">
              <label>Skriv inn Systemnavn</label>
              <input
                type="text"
                value={newLicenseNameCreate}
                onChange={(e) => setNewLicenseNameCreate(e.target.value)}
              />
            </div>
          </div>
          <div className="manage-teams-buttons">
            <GreenButton
              text="Legg til"
              onClick={() => handleSave("leggtil")}
            />
          </div>

          {/* AlertBox for opprettelse */}
          {createSuccess && (
            <AlertBox
              type="success"
              title="Opprettet!"
              message="Nytt system ble opprettet."
            />
          )}
          {createError && (
            <AlertBox type="error" title="Feil" message={createError}>
              <RedButton text="Lukk" onClick={() => setCreateError("")} />
            </AlertBox>
          )}
        </div>

        {/* Slett System */}
        <div className="form-section team-box">
          <h2 className="section-heading">Slett System</h2>
          <div className="two-column">
            <div className="column">
              <label>Velg System</label>
              <select
                value={selectedLicenseDelete}
                onChange={(e) => setSelectedLicenseDelete(e.target.value)}
              >
                <option value="">Velg system</option>
                {licenses.map((license) => (
                  <option key={license.license_id} value={license.license_id}>
                    {license.license_title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="manage-teams-buttons">
            <RedButton text="Slett" onClick={() => setShowDeleteAlert(true)} />
          </div>

          {/* AlertBox for sletting */}
          {deleteSuccess && (
            <AlertBox
              type="success"
              title="Slettet!"
              message="Systemet ble slettet."
            />
          )}
          {deleteError && (
            <AlertBox type="error" title="Feil" message={deleteError}>
              <RedButton text="Lukk" onClick={() => setDeleteError("")} />
            </AlertBox>
          )}
        </div>

        {/* Bekreftelsesdialoger */}
        {showSaveAlert && (
          <AlertBox type="confirmation" title="Bekreft" message="Er du sikker?">
            <WhiteButton text="Fortsett" onClick={confirmSave} />
            <RedButton text="Avbryt" onClick={() => setShowSaveAlert(false)} />
          </AlertBox>
        )}

        {showDeleteAlert && (
          <AlertBox
            type="confirmation"
            title="Bekreft sletting"
            message="Er du sikker?"
          >
            <WhiteButton text="Fortsett" onClick={confirmDelete} />
            <RedButton
              text="Avbryt"
              onClick={() => setShowDeleteAlert(false)}
            />
          </AlertBox>
        )}
      </div>
    </div>
  );
};

export default ManageSystems;
