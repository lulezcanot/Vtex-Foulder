import React from 'react';

const ComponentCard = ({ component, onEdit, onDelete, onView }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMainFile = () => {
    return component.files?.find(file => file.isMain) || component.files?.[0];
  };

  const mainFile = getMainFile();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {component.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {component.description}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          </div>
        </div>
      </div>

      {/* Category and Tags */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
            {component.category?.name || 'Sin categoría'}
          </span>
          <span className="text-xs text-gray-500">
            {component.files?.length || 0} archivo{component.files?.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {component.tags && component.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {component.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200"
              >
                {tag}
              </span>
            ))}
            {component.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                +{component.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Code Preview */}
      {mainFile && (
        <div className="p-6 border-b border-gray-200">
          <div className="text-xs text-gray-500 mb-3 font-medium">
            {mainFile.filename} • {mainFile.fileType.toUpperCase()}
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-hidden">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap line-clamp-4 font-mono">
              {mainFile.content.substring(0, 200)}
              {mainFile.content.length > 200 && '...'}
            </pre>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-6 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-gray-500 space-y-1">
            <div>Por: <span className="font-medium text-gray-600">{component.createdBy?.username}</span></div>
            <div>Creado: {formatDate(component.createdAt)}</div>
            {component.updatedAt !== component.createdAt && (
              <div>Editado: {formatDate(component.updatedAt)}</div>
            )}
          </div>
          <div className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
            v{component.version}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onView(component._id)}
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors cursor-pointer"
          >
            Ver
          </button>
          <button
            onClick={() => onEdit(component._id)}
            className="flex-1 bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-300 cursor-pointer"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(component._id)}
            className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border border-red-200 cursor-pointer"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComponentCard;
